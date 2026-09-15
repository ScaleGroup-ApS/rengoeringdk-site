export const CONTACT_SPAM_ERROR =
  "Bekræft venligst, at du ikke er en robot, og prøv igen.";

type Environment = Record<string, string | undefined>;

export function turnstileEnabled(env: Environment = process.env): boolean {
  if (env.TURNSTILE_ENABLED === "false") return false;
  return (
    env.TURNSTILE_ENABLED === "true" ||
    !!(env.TURNSTILE_SITE_KEY || env.TURNSTILE_SECRET_KEY)
  );
}

function provider(env: Environment): string {
  return (
    env.CONTACT_SPAM_PROVIDER ?? (turnstileEnabled(env) ? "turnstile" : "none")
  );
}

export function contactChallenge(env: Environment = process.env) {
  const selected = provider(env);
  return {
    provider: selected,
    siteKey:
      selected === "altcha"
        ? env.ALTCHA_SITE_KEY || null
        : selected === "cap"
          ? env.CAP_SITE_KEY || null
          : selected === "turnstile"
            ? env.TURNSTILE_SITE_KEY || null
            : null,
    baseUrl:
      selected === "altcha"
        ? env.ALTCHA_PUBLIC_BASE_URL || null
        : selected === "cap"
          ? env.CAP_PUBLIC_BASE_URL || null
          : null,
  };
}

async function verifySelfHosted(
  token: FormDataEntryValue | null,
  env: Environment,
  verifyFetch: typeof fetch,
): Promise<boolean> {
  const altcha = provider(env) === "altcha";
  const siteKey = altcha ? env.ALTCHA_SITE_KEY : env.CAP_SITE_KEY;
  const secret = altcha ? env.ALTCHA_SECRET_KEY : env.CAP_SECRET_KEY;
  const baseUrl = altcha ? env.ALTCHA_VERIFY_BASE_URL : env.CAP_VERIFY_BASE_URL;
  const validToken =
    typeof token === "string" &&
    token.trim() === token &&
    (altcha
      ? token.length <= 8192 &&
        token.length % 4 === 0 &&
        /^[A-Za-z0-9+/]+={0,2}$/.test(token)
      : token.length <= 2048 &&
        /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+$/.test(token) &&
        token.split(":")[0] === siteKey);
  if (
    !siteKey ||
    !/^[a-zA-Z0-9_-]{1,128}$/.test(siteKey) ||
    !secret ||
    !baseUrl ||
    !validToken
  )
    return false;
  try {
    const base = new URL(baseUrl);
    if (
      !["https:", "http:"].includes(base.protocol) ||
      base.username ||
      base.password ||
      base.search ||
      base.hash
    )
      return false;
    const response = await verifyFetch(
      `${base.href.replace(/\/$/, "")}/${siteKey}/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return (
      !!result &&
      typeof result === "object" &&
      !Array.isArray(result) &&
      (result as Record<string, unknown>).success === true
    );
  } catch {
    return false;
  }
}

/** The site server verifies once, before storage or relay; tokens never go to CRM. */
export async function verifyContactSubmission(
  form: FormData,
  env: Environment = process.env,
  verifyFetch: typeof fetch = fetch,
): Promise<boolean> {
  const honeypot = form.get("contact_website");
  if (honeypot !== null && honeypot !== "") return false;
  const selected = provider(env);
  if (selected === "none") return true;
  const token = form.get("turnstile_token");
  if (selected === "cap" || selected === "altcha")
    return verifySelfHosted(token, env, verifyFetch);
  if (selected !== "turnstile") return false;
  const hosts = (env.TURNSTILE_HOSTNAMES || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  if (
    typeof token !== "string" ||
    !token ||
    token.length > 2048 ||
    !env.TURNSTILE_SECRET_KEY ||
    !env.TURNSTILE_SITE_KEY ||
    !hosts.length
  )
    return false;
  try {
    const response = await verifyFetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        redirect: "error",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return false;
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") return false;
    const verdict = result as Record<string, unknown>;
    return (
      verdict.success === true &&
      verdict.action === "contact" &&
      typeof verdict.hostname === "string" &&
      hosts.includes(verdict.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}
