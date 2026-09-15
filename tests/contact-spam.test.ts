import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyContactSubmission } from "../app/lib/contact-spam.server";

const env = {
  TURNSTILE_SITE_KEY: "site",
  TURNSTILE_SECRET_KEY: "secret",
  TURNSTILE_HOSTNAMES: "example.dk,www.example.dk",
};
function form(token: string | null = "token") {
  const data = new FormData();
  if (token !== null) data.set("turnstile_token", token);
  return data;
}
const fake = (body: unknown, status = 200) =>
  (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
const valid = { success: true, hostname: "example.dk", action: "contact" };

test("accepts a valid challenge and only sends the token and secret to Siteverify", async () => {
  let calls = 0;
  const verifyFetch = (async (url: unknown, options: RequestInit) => {
    calls++;
    assert.equal(
      url,
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    assert.equal(options.method, "POST");
    assert.deepEqual(Object.fromEntries(options.body as URLSearchParams), {
      secret: "secret",
      response: "token",
    });
    assert.ok(options.signal);
    return new Response(JSON.stringify(valid));
  }) as typeof fetch;
  assert.equal(await verifyContactSubmission(form(), env, verifyFetch), true);
  assert.equal(calls, 1);
});
for (const [name, body, status] of [
  [
    "rejected or replayed",
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    200,
  ],
  ["wrong hostname", { ...valid, hostname: "attacker.dk" }, 200],
  ["wrong action", { ...valid, action: "login" }, 200],
  ["missing metadata", { success: true }, 200],
  ["malformed response", null, 200],
  ["non-boolean success", { ...valid, success: "true" }, 200],
  ["provider outage", valid, 503],
] as const) {
  test(`rejects ${name}`, async () =>
    assert.equal(
      await verifyContactSubmission(form(), env, fake(body, status)),
      false,
    ));
}
test("fails closed on timeout and non-JSON responses", async () => {
  assert.equal(
    await verifyContactSubmission(form(), env, (async () => {
      throw new Error("timeout");
    }) as typeof fetch),
    false,
  );
  assert.equal(
    await verifyContactSubmission(
      form(),
      env,
      (async () => new Response("not json")) as typeof fetch,
    ),
    false,
  );
});
test("rejects missing, oversized, and non-string tokens without HTTP", async () => {
  let unexpectedCalls = 0;
  const neverFetch = (async () => {
    unexpectedCalls++;
    assert.fail("unexpected verification request");
  }) as typeof fetch;
  for (const token of [null, "", "a".repeat(2049)])
    assert.equal(
      await verifyContactSubmission(form(token), env, neverFetch),
      false,
    );
  const file = form();
  file.set("turnstile_token", new Blob(["token"]));
  assert.equal(await verifyContactSubmission(file, env, neverFetch), false);
  assert.equal(unexpectedCalls, 0);
});
test("rejects partially configured deployments", async () => {
  for (const key of Object.keys(env))
    assert.equal(
      await verifyContactSubmission(form(), { ...env, [key]: "" }, fake(valid)),
      false,
    );
});
test("allows unconfigured deployments but keeps the honeypot active", async () => {
  assert.equal(
    await verifyContactSubmission(form(null), {}, fake(valid)),
    true,
  );
  const data = form(null);
  data.set("contact_website", "https://spam.example");
  assert.equal(await verifyContactSubmission(data, {}, fake(valid)), false);
});

const capEnv = {
  CONTACT_SPAM_PROVIDER: "cap",
  TURNSTILE_ENABLED: "false",
  CAP_SITE_KEY: "customer10",
  CAP_SECRET_KEY: "cap-secret",
  CAP_VERIFY_BASE_URL: "http://cap.internal:3000",
  CAP_PUBLIC_BASE_URL: "https://challenge.example.dk",
};
const capToken = "customer10:token-id:token-secret";

test("Cap selection overrides disabled legacy configuration and consumes once without redirects", async () => {
  let calls = 0;
  const verifyFetch = (async (url: unknown, options: RequestInit) => {
    calls++;
    assert.equal(url, "http://cap.internal:3000/customer10/siteverify");
    assert.equal(options.redirect, "error");
    assert.equal(options.method, "POST");
    assert.ok(options.signal);
    assert.deepEqual(JSON.parse(options.body as string), {
      secret: "cap-secret",
      response: capToken,
    });
    return new Response('{"success":true}');
  }) as typeof fetch;
  assert.equal(
    await verifyContactSubmission(form(capToken), capEnv, verifyFetch),
    true,
  );
  assert.equal(calls, 1);
});

test("Cap fails before HTTP for wrong tenant, malformed tokens and invalid configuration", async () => {
  let unexpectedCalls = 0;
  const neverFetch = (async () => {
    unexpectedCalls++;
    assert.fail("unexpected verification request");
  }) as typeof fetch;
  for (const token of [
    null,
    "",
    "customer100:token:secret",
    "other:token:secret",
    "customer10:a:b:extra",
    "customer10:a:",
    "customer10:a:b\n",
    "a".repeat(2049),
  ]) {
    assert.equal(
      await verifyContactSubmission(form(token), capEnv, neverFetch),
      false,
    );
  }
  const file = form();
  file.set("turnstile_token", new Blob([capToken]));
  assert.equal(await verifyContactSubmission(file, capEnv, neverFetch), false);
  for (const key of ["CAP_SITE_KEY", "CAP_SECRET_KEY", "CAP_VERIFY_BASE_URL"]) {
    assert.equal(
      await verifyContactSubmission(
        form(capToken),
        { ...capEnv, [key]: "" },
        neverFetch,
      ),
      false,
    );
  }
  for (const url of [
    "garbage",
    "ftp://cap.internal",
    "http://user:password@cap.internal",
    "http://cap.internal#fragment",
    "http://cap.internal?redirect=external",
  ]) {
    assert.equal(
      await verifyContactSubmission(
        form(capToken),
        { ...capEnv, CAP_VERIFY_BASE_URL: url },
        neverFetch,
      ),
      false,
    );
  }
  assert.equal(
    await verifyContactSubmission(
      form(capToken),
      { ...capEnv, CONTACT_SPAM_PROVIDER: "typo" },
      neverFetch,
    ),
    false,
  );
  assert.equal(unexpectedCalls, 0);
});

test("Cap rejects forged, expired, replayed and malformed verdicts, redirects and outages", async () => {
  for (const [body, status] of [
    [{ success: false }, 200],
    [{ success: "true" }, 200],
    [null, 200],
    [[], 200],
    [{ success: true }, 302],
    [{ success: true }, 503],
  ] as const) {
    assert.equal(
      await verifyContactSubmission(form(capToken), capEnv, fake(body, status)),
      false,
    );
  }
  for (const verifyFetch of [
    (async () => {
      throw new Error("timeout");
    }) as typeof fetch,
    (async () => new Response("not JSON")) as typeof fetch,
  ]) {
    assert.equal(
      await verifyContactSubmission(form(capToken), capEnv, verifyFetch),
      false,
    );
  }
  const data = form(capToken);
  data.set("contact_website", "spam");
  assert.equal(
    await verifyContactSubmission(data, capEnv, fake({ success: true })),
    false,
  );
});

test("browser configuration exposes only the selected public fields", async () => {
  const { contactChallenge } = await import("../app/lib/contact-spam.server");
  assert.deepEqual(contactChallenge(capEnv), {
    provider: "cap",
    siteKey: "customer10",
    baseUrl: "https://challenge.example.dk",
  });
  assert.equal(
    JSON.stringify(contactChallenge(capEnv)).includes("cap-secret"),
    false,
  );
});

const altchaEnv = {
  CONTACT_SPAM_PROVIDER: "altcha",
  TURNSTILE_ENABLED: "false",
  ALTCHA_SITE_KEY: "customer10",
  ALTCHA_SECRET_KEY: "altcha-secret",
  ALTCHA_VERIFY_BASE_URL: "http://altcha.internal:3001",
  ALTCHA_PUBLIC_BASE_URL: "https://challenge.example.dk",
};
const altchaToken = "eyJwcm9vZiI6ImV4YW1wbGUifQ==";

test("Altcha selection overrides disabled legacy configuration and consumes once without redirects", async () => {
  let calls = 0;
  const verifyFetch = (async (url: unknown, options: RequestInit) => {
    calls++;
    assert.equal(url, "http://altcha.internal:3001/customer10/siteverify");
    assert.equal(options.redirect, "error");
    assert.equal(options.method, "POST");
    assert.ok(options.signal);
    assert.deepEqual(JSON.parse(options.body as string), {
      secret: "altcha-secret",
      response: altchaToken,
    });
    return new Response('{"success":true}');
  }) as typeof fetch;
  assert.equal(
    await verifyContactSubmission(form(altchaToken), altchaEnv, verifyFetch),
    true,
  );
  assert.equal(calls, 1);
});

test("Altcha fails before HTTP for wrong tenant, malformed tokens and invalid configuration", async () => {
  let unexpectedCalls = 0;
  const neverFetch = (async () => {
    unexpectedCalls++;
    assert.fail("unexpected verification request");
  }) as typeof fetch;
  for (const token of [
    null,
    "",
    "customer100:token:secret",
    "other:token:secret",
    "customer10:a:b:extra",
    "customer10:a:",
    "customer10:a:b\n",
    "a".repeat(8196),
  ]) {
    assert.equal(
      await verifyContactSubmission(form(token), altchaEnv, neverFetch),
      false,
    );
  }
  const file = form();
  file.set("turnstile_token", new Blob([altchaToken]));
  assert.equal(
    await verifyContactSubmission(file, altchaEnv, neverFetch),
    false,
  );
  for (const key of [
    "ALTCHA_SITE_KEY",
    "ALTCHA_SECRET_KEY",
    "ALTCHA_VERIFY_BASE_URL",
  ]) {
    assert.equal(
      await verifyContactSubmission(
        form(altchaToken),
        { ...altchaEnv, [key]: "" },
        neverFetch,
      ),
      false,
    );
  }
  for (const url of [
    "garbage",
    "ftp://altcha.internal",
    "http://user:password@altcha.internal",
    "http://altcha.internal#fragment",
    "http://altcha.internal?redirect=external",
  ]) {
    assert.equal(
      await verifyContactSubmission(
        form(altchaToken),
        { ...altchaEnv, ALTCHA_VERIFY_BASE_URL: url },
        neverFetch,
      ),
      false,
    );
  }
  assert.equal(
    await verifyContactSubmission(
      form(altchaToken),
      { ...altchaEnv, CONTACT_SPAM_PROVIDER: "typo" },
      neverFetch,
    ),
    false,
  );
  assert.equal(unexpectedCalls, 0);
});

test("Altcha rejects forged, expired, replayed and malformed verdicts, redirects and outages", async () => {
  for (const [body, status] of [
    [{ success: false }, 200],
    [{ success: "true" }, 200],
    [null, 200],
    [[], 200],
    [{ success: true }, 302],
    [{ success: true }, 503],
  ] as const) {
    assert.equal(
      await verifyContactSubmission(
        form(altchaToken),
        altchaEnv,
        fake(body, status),
      ),
      false,
    );
  }
  for (const verifyFetch of [
    (async () => {
      throw new Error("timeout");
    }) as typeof fetch,
    (async () => new Response("not JSON")) as typeof fetch,
  ]) {
    assert.equal(
      await verifyContactSubmission(form(altchaToken), altchaEnv, verifyFetch),
      false,
    );
  }
  const data = form(altchaToken);
  data.set("contact_website", "spam");
  assert.equal(
    await verifyContactSubmission(data, altchaEnv, fake({ success: true })),
    false,
  );
});

test("ALTCHA browser configuration exposes only public fields", async () => {
  const { contactChallenge } = await import("../app/lib/contact-spam.server");
  assert.deepEqual(contactChallenge(altchaEnv), {
    provider: "altcha",
    siteKey: "customer10",
    baseUrl: "https://challenge.example.dk",
  });
  assert.equal(
    JSON.stringify(contactChallenge(altchaEnv)).includes("altcha-secret"),
    false,
  );
});
