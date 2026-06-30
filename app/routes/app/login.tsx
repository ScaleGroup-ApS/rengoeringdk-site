import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import { eq } from "drizzle-orm";
import { safeParse } from "valibot";
import type { Route } from "./+types/login";
import { getDb } from "~/lib/db.server";
import { appUsers } from "~/db/schema";
import { getUser, createUserSession } from "~/lib/auth/guards.server";
import { verifyPassword } from "~/lib/auth/password.server";
import { LoginSchema } from "~/lib/auth/schema";

export function meta() {
  return [{ title: "Log ind — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  if (user) throw redirect("/app");
  return null;
}

function safeNext(next: string | null): string {
  // Only allow internal app paths — never an absolute/external URL.
  if (next && next.startsWith("/app")) return next;
  return "/app";
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const next = safeNext(String(form.get("next") ?? ""));
  const parsed = safeParse(LoginSchema, {
    email: String(form.get("email") ?? "").trim().toLowerCase(),
    password: String(form.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: "Skriv venligst en gyldig e-mail og adgangskode." };
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, parsed.output.email))
    .limit(1);
  const user = rows[0];

  // Generic error to avoid revealing whether the email exists.
  const generic = { error: "Forkert e-mail eller adgangskode." };
  if (!user) return generic;
  const ok = await verifyPassword(parsed.output.password, user.passwordHash);
  if (!ok) return generic;

  const cookie = await createUserSession(request, user.id, user.tokenVersion);
  return redirect(next, { headers: { "Set-Cookie": cookie } });
}

export default function Login({ actionData }: Route.ComponentProps) {
  const [params] = useSearchParams();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <div className="app-auth">
      <div className="app-card app-auth-card">
        <h1 className="app-h1">Log ind</h1>
        <p className="app-sub">Få overblik over dine bookinger og book ny rengøring.</p>

        {actionData?.error && <p className="app-alert">{actionData.error}</p>}

        <Form method="post" className="app-form" noValidate>
          <input type="hidden" name="next" value={params.get("next") ?? ""} />
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Adgangskode</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? "Logger ind …" : "Log ind"}
          </button>
        </Form>

        <p className="app-auth-alt">
          Har du ikke en konto? <Link to="/app/register">Opret konto</Link>
        </p>
      </div>
    </div>
  );
}
