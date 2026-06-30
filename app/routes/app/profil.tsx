import { Form, useNavigation } from "react-router";
import { eq } from "drizzle-orm";
import { safeParse } from "valibot";
import type { Route } from "./+types/profil";
import { requireUser } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appUsers } from "~/db/schema";
import { ProfileSchema } from "~/lib/auth/schema";

export function meta() {
  return [{ title: "Min profil — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const form = await request.formData();
  const parsed = safeParse(ProfileSchema, {
    navn: String(form.get("navn") ?? ""),
    tlf: String(form.get("tlf") ?? ""),
    virksomhed: String(form.get("virksomhed") ?? ""),
    cvr: String(form.get("cvr") ?? ""),
    adresse: String(form.get("adresse") ?? ""),
    postnr: String(form.get("postnr") ?? ""),
    by: String(form.get("by") ?? ""),
  });
  if (!parsed.success) return { error: "Tjek venligst felterne." };

  const db = getDb();
  await db
    .update(appUsers)
    .set({
      navn: parsed.output.navn,
      tlf: parsed.output.tlf ?? null,
      virksomhed: parsed.output.virksomhed ?? null,
      cvr: parsed.output.cvr ?? null,
      adresse: parsed.output.adresse ?? null,
      postnr: parsed.output.postnr ?? null,
      by: parsed.output.by ?? null,
    })
    .where(eq(appUsers.id, user.id));

  return { ok: true };
}

export default function Profil({ loaderData, actionData }: Route.ComponentProps) {
  const { user } = loaderData;
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <div className="app-page">
      <h1 className="app-h1">Min profil</h1>
      <p className="app-sub">{user.email} · {user.audience === "privat" ? "Privatkunde" : "Erhvervskunde"}</p>

      {actionData?.ok && <p className="app-success">Dine oplysninger er gemt.</p>}
      {actionData?.error && <p className="app-alert">{actionData.error}</p>}

      <Form method="post" className="app-form app-card" noValidate>
        <div className="field">
          <label htmlFor="navn">Navn</label>
          <input id="navn" name="navn" type="text" defaultValue={user.navn} required />
        </div>
        {user.audience === "erhverv" && (
          <div className="app-form-row">
            <div className="field">
              <label htmlFor="virksomhed">Virksomhed</label>
              <input id="virksomhed" name="virksomhed" type="text" defaultValue={user.virksomhed ?? ""} />
            </div>
            <div className="field">
              <label htmlFor="cvr">CVR</label>
              <input id="cvr" name="cvr" type="text" inputMode="numeric" maxLength={8} defaultValue={user.cvr ?? ""} />
            </div>
          </div>
        )}
        <div className="field">
          <label htmlFor="tlf">Telefon</label>
          <input id="tlf" name="tlf" type="tel" defaultValue={user.tlf ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="adresse">Adresse</label>
          <input id="adresse" name="adresse" type="text" autoComplete="street-address" defaultValue={user.adresse ?? ""} />
        </div>
        <div className="app-form-row">
          <div className="field">
            <label htmlFor="postnr">Postnr.</label>
            <input id="postnr" name="postnr" type="text" inputMode="numeric" defaultValue={user.postnr ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="by">By</label>
            <input id="by" name="by" type="text" defaultValue={user.by ?? ""} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? "Gemmer …" : "Gem ændringer"}
        </button>
      </Form>
    </div>
  );
}
