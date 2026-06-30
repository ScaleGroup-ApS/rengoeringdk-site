import { Form, Link, redirect, useNavigation } from "react-router";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { safeParse, flatten } from "valibot";
import type { Route } from "./+types/register";
import { getDb } from "~/lib/db.server";
import { appUsers } from "~/db/schema";
import { getUser, createUserSession } from "~/lib/auth/guards.server";
import { hashPassword } from "~/lib/auth/password.server";
import { RegisterSchema } from "~/lib/auth/schema";

export function meta() {
  return [{ title: "Opret konto — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  if (user) throw redirect("/app");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const parsed = safeParse(RegisterSchema, {
    navn: String(form.get("navn") ?? ""),
    email: String(form.get("email") ?? "").trim().toLowerCase(),
    password: String(form.get("password") ?? ""),
    tlf: String(form.get("tlf") ?? ""),
    audience: String(form.get("audience") ?? "privat"),
    virksomhed: String(form.get("virksomhed") ?? ""),
  });
  if (!parsed.success) {
    const errs = flatten(parsed.issues).nested ?? {};
    const first = Object.values(errs)[0]?.[0];
    return { error: first ?? "Tjek venligst felterne og prøv igen." };
  }

  const db = getDb();
  const existing = await db
    .select({ id: appUsers.id })
    .from(appUsers)
    .where(eq(appUsers.email, parsed.output.email))
    .limit(1);
  if (existing.length > 0) {
    return { error: "Der findes allerede en konto med denne e-mail." };
  }

  const passwordHash = await hashPassword(parsed.output.password);
  try {
    const [res] = await db.insert(appUsers).values({
      email: parsed.output.email,
      passwordHash,
      role: "customer",
      navn: parsed.output.navn,
      tlf: parsed.output.tlf,
      audience: parsed.output.audience,
      virksomhed: parsed.output.virksomhed ?? null,
    });
    const userId = (res as { insertId: number }).insertId;
    const cookie = await createUserSession(request, userId, 0);
    return redirect("/app", { headers: { "Set-Cookie": cookie } });
  } catch {
    // Unique-constraint race fallback.
    return { error: "Der findes allerede en konto med denne e-mail." };
  }
}

export default function Register({ actionData }: Route.ComponentProps) {
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [audience, setAudience] = useState<"privat" | "erhverv">("privat");

  return (
    <div className="app-auth">
      <div className="app-card app-auth-card">
        <h1 className="app-h1">Opret konto</h1>
        <p className="app-sub">Det tager under et minut — så kan du booke og styre din rengøring.</p>

        {actionData?.error && <p className="app-alert">{actionData.error}</p>}

        <Form method="post" className="app-form" noValidate>
          <div className="app-seg" role="tablist" aria-label="Kundetype">
            <button type="button" className={audience === "privat" ? "sel" : ""} onClick={() => setAudience("privat")} aria-pressed={audience === "privat"}>Privat</button>
            <button type="button" className={audience === "erhverv" ? "sel" : ""} onClick={() => setAudience("erhverv")} aria-pressed={audience === "erhverv"}>Erhverv</button>
          </div>
          <input type="hidden" name="audience" value={audience} />

          <div className="field">
            <label htmlFor="navn">Navn</label>
            <input id="navn" name="navn" type="text" autoComplete="name" required />
          </div>
          {audience === "erhverv" && (
            <div className="field">
              <label htmlFor="virksomhed">Virksomhed</label>
              <input id="virksomhed" name="virksomhed" type="text" autoComplete="organization" />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="tlf">Telefon</label>
            <input id="tlf" name="tlf" type="tel" autoComplete="tel" required />
          </div>
          <div className="field">
            <label htmlFor="password">Adgangskode</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
            <span className="app-hint">Mindst 8 tegn.</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? "Opretter …" : "Opret konto"}
          </button>
        </Form>

        <p className="app-auth-alt">
          Har du allerede en konto? <Link to="/app/login">Log ind</Link>
        </p>
      </div>
    </div>
  );
}
