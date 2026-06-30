import { Form, useNavigation } from "react-router";
import { eq } from "drizzle-orm";
import type { Route } from "./+types/priser";
import { requireAdmin } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import {
  appPricingAddons,
  appPricingFrequencies,
  appPricingPropertyTypes,
  appPricingSettings,
} from "~/db/schema";
import { getPricingConfig, invalidatePricingCache } from "~/lib/pricing.server";
import { addonSubLabel } from "~/lib/pricing";

export function meta() {
  return [{ title: "Prisberegner — Admin" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const pricing = await getPricingConfig();
  return { pricing };
}

const numOrNull = (v: FormDataEntryValue | null): number | null => {
  const s = String(v ?? "").trim().replace(",", ".");
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const form = await request.formData();
  const db = getDb();

  const updates: Promise<unknown>[] = [];

  // Settings (base price + VAT) per audience.
  for (const audience of ["privat", "erhverv"] as const) {
    const base = numOrNull(form.get(`base_${audience}`));
    const vat = numOrNull(form.get(`vat_${audience}`));
    if (base !== null && vat !== null) {
      updates.push(
        db
          .update(appPricingSettings)
          .set({ basePrice: Math.round(base), vatMultiplier: vat.toFixed(2) })
          .where(eq(appPricingSettings.audience, audience)),
      );
    }
  }

  // Per-row updates keyed by id.
  for (const [key, value] of form.entries()) {
    const rate = key.match(/^ptype_rate_(\d+)$/);
    if (rate) {
      const n = numOrNull(value);
      if (n !== null) {
        updates.push(
          db
            .update(appPricingPropertyTypes)
            .set({ rate: n.toFixed(2) })
            .where(eq(appPricingPropertyTypes.id, Number(rate[1]))),
        );
      }
      continue;
    }
    const fmult = key.match(/^freq_mult_(\d+)$/);
    if (fmult) {
      const n = numOrNull(value);
      if (n !== null) {
        updates.push(
          db
            .update(appPricingFrequencies)
            .set({ multiplier: n.toFixed(2) })
            .where(eq(appPricingFrequencies.id, Number(fmult[1]))),
        );
      }
      continue;
    }
    const aadd = key.match(/^addon_add_(\d+)$/);
    if (aadd) {
      const n = numOrNull(value);
      updates.push(
        db
          .update(appPricingAddons)
          .set({ addAmount: n === null ? null : Math.round(n) })
          .where(eq(appPricingAddons.id, Number(aadd[1]))),
      );
      continue;
    }
  }

  await Promise.all(updates);
  invalidatePricingCache();
  return { ok: true };
}

export default function AdminPriser({ loaderData, actionData }: Route.ComponentProps) {
  const { pricing } = loaderData;
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <div className="admin-page">
      <h1 className="app-h1">Prisberegner</h1>
      <p className="app-sub">Justér grundpriser, m²-takster, frekvenser og tilvalg. Ændringer slår igennem på den offentlige prisberegner med det samme.</p>

      {actionData?.ok && <p className="app-success">Priserne er gemt.</p>}

      <Form method="post" className="admin-pricing">
        {(["privat", "erhverv"] as const).map((audience) => {
          const a = pricing[audience];
          return (
            <section key={audience} className="app-card admin-pricing-section">
              <h2 className="app-h2">{audience === "privat" ? "Privat" : "Erhverv"}</h2>

              <div className="admin-pricing-grid">
                <div className="field">
                  <label htmlFor={`base_${audience}`}>Grundpris (kr.)</label>
                  <input id={`base_${audience}`} name={`base_${audience}`} type="number" min={0} step={1} defaultValue={a.basePrice} />
                </div>
                <div className="field">
                  <label htmlFor={`vat_${audience}`}>Moms-faktor</label>
                  <input id={`vat_${audience}`} name={`vat_${audience}`} type="number" min={0} step="0.01" defaultValue={a.vatMultiplier} />
                  <span className="app-hint">1.25 = inkl. moms · 1.00 = ekskl. moms</span>
                </div>
              </div>

              <h3 className="admin-pricing-subhead">Typer (kr. pr. m²)</h3>
              <div className="admin-pricing-rows">
                {a.propertyTypes.map((p) => (
                  <div key={p.id} className="admin-pricing-row">
                    <span>{p.name}</span>
                    <input name={`ptype_rate_${p.id}`} type="number" min={0} step="0.1" defaultValue={p.rate} aria-label={`${p.name} takst`} />
                  </div>
                ))}
              </div>

              <h3 className="admin-pricing-subhead">Tilvalg (kr.)</h3>
              <div className="admin-pricing-rows">
                {a.addons.map((ad) => (
                  <div key={ad.id} className="admin-pricing-row">
                    <span>{ad.name} <small className="app-meta">{addonSubLabel(ad)}</small></span>
                    {ad.pct != null ? (
                      <input value={`${Math.round(ad.pct * 100)}%`} disabled aria-label={`${ad.name} procent`} />
                    ) : (
                      <input name={`addon_add_${ad.id}`} type="number" min={0} step={1} defaultValue={ad.add} aria-label={`${ad.name} pris`} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <section className="app-card admin-pricing-section">
          <h2 className="app-h2">Frekvenser (faktor)</h2>
          <p className="app-hint">Faktoren ganges på prisen. Under 1 = rabat ved hyppig rengøring, over 1 = tillæg.</p>
          <div className="admin-pricing-rows">
            {pricing.frequencies.map((f) => (
              <div key={f.id} className="admin-pricing-row">
                <span>{f.name}</span>
                <input name={`freq_mult_${f.id}`} type="number" min={0} step="0.01" defaultValue={f.multiplier} aria-label={`${f.name} faktor`} />
              </div>
            ))}
          </div>
        </section>

        <div className="admin-pricing-save">
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? "Gemmer …" : "Gem priser"}
          </button>
        </div>
      </Form>
    </div>
  );
}
