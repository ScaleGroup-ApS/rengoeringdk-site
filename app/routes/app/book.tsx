import { useMemo, useState } from "react";
import { Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/book";
import { requireUser } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings } from "~/db/schema";
import { getPricingConfig } from "~/lib/pricing.server";
import { calcPerVisit, kr } from "~/lib/pricing";
import { notifyBookingRequest } from "~/lib/booking-notify.server";
import { RECURRENCE_LABELS, type Recurrence } from "~/lib/bookings";

export function meta() {
  return [{ title: "Book rengøring — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

const TIME_WINDOWS = ["08:00", "10:00", "12:00", "14:00", "16:00"];
const RECURRENCES: Recurrence[] = ["once", "weekly", "biweekly", "monthly"];
// Map booking recurrence → the pricing frequency name used by the calculator.
const RECURRENCE_TO_FREQ: Record<Recurrence, string> = {
  weekly: "Ugentligt",
  biweekly: "Hver 14. dag",
  monthly: "Månedligt",
  once: "Engangs",
};

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  if (user.role === "admin") throw redirect("/app/admin");
  const pricing = await getPricingConfig();
  return { user, pricing };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const form = await request.formData();

  const service = String(form.get("service") ?? "").trim();
  const audience = user.audience;
  const requestedDate = String(form.get("requestedDate") ?? "").trim();
  const requestedTime = String(form.get("requestedTime") ?? "").trim() || null;
  const recurrence = String(form.get("recurrence") ?? "once").trim();
  const m2raw = Number(form.get("m2"));
  const m2 = Number.isFinite(m2raw) && m2raw > 0 ? Math.round(m2raw) : null;
  const address = String(form.get("address") ?? "").trim() || null;
  const postnr = String(form.get("postnr") ?? "").trim() || null;
  const by = String(form.get("by") ?? "").trim() || null;
  const customerNote = String(form.get("customerNote") ?? "").trim() || null;

  if (!service || !requestedDate) {
    return { error: "Vælg venligst en ydelse og en ønsket dato." };
  }

  // Recompute the estimate server-side (never trust a client number).
  const pricing = await getPricingConfig();
  const aud = audience === "privat" ? pricing.privat : pricing.erhverv;
  const ptype = aud.propertyTypes.find((p) => p.name === service);
  const freq = pricing.frequencies.find(
    (f) => f.name === RECURRENCE_TO_FREQ[recurrence as Recurrence],
  );
  let estimatedPrice: number | null = null;
  if (ptype && m2) {
    estimatedPrice = Math.round(
      calcPerVisit({
        basePrice: aud.basePrice,
        m2,
        rate: ptype.rate,
        freqMultiplier: freq?.multiplier ?? 1,
        addonFlat: 0,
        vatMultiplier: aud.vatMultiplier,
      }),
    );
  }

  const db = getDb();
  await db.insert(appBookings).values({
    userId: user.id,
    status: "requested",
    service,
    audience,
    requestedDate,
    requestedTime,
    recurrence,
    address,
    postnr,
    by,
    m2,
    estimatedPrice,
    customerNote,
  });

  await notifyBookingRequest({
    name: user.navn,
    email: user.email,
    phone: user.tlf,
    company: user.virksomhed,
    service,
    requestedDate,
    requestedTime,
    recurrence,
    address,
    estimatedPrice,
    note: customerNote,
  });

  return redirect("/app/bookinger?ny=1");
}

export default function Book({ loaderData, actionData }: Route.ComponentProps) {
  const { user, pricing } = loaderData;
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  const aud = user.audience === "privat" ? pricing.privat : pricing.erhverv;
  const [service, setService] = useState(aud.propertyTypes[0]?.name ?? "");
  const [m2, setM2] = useState(user.audience === "privat" ? 80 : 150);
  const [recurrence, setRecurrence] = useState<Recurrence>("biweekly");

  const estimate = useMemo(() => {
    const ptype = aud.propertyTypes.find((p) => p.name === service);
    const freq = pricing.frequencies.find((f) => f.name === RECURRENCE_TO_FREQ[recurrence]);
    if (!ptype) return null;
    return calcPerVisit({
      basePrice: aud.basePrice,
      m2,
      rate: ptype.rate,
      freqMultiplier: freq?.multiplier ?? 1,
      addonFlat: 0,
      vatMultiplier: aud.vatMultiplier,
    });
  }, [aud, pricing.frequencies, service, m2, recurrence]);

  return (
    <div className="app-page">
      <h1 className="app-h1">Book rengøring</h1>
      <p className="app-sub">Foreslå en dato — vi bekræfter den hurtigst muligt.</p>

      {actionData?.error && <p className="app-alert">{actionData.error}</p>}

      <Form method="post" className="app-form app-card" noValidate>
        <div className="field">
          <label htmlFor="service">Ydelse</label>
          <select id="service" name="service" value={service} onChange={(e) => setService(e.target.value)}>
            {aud.propertyTypes.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="m2">Areal: {m2.toLocaleString("da-DK")} m²</label>
          <input id="m2" name="m2" type="range" className="rng" min={20} max={2000} step={10} value={m2} onChange={(e) => setM2(parseInt(e.target.value, 10))} />
        </div>

        <div className="field">
          <label htmlFor="recurrence">Frekvens</label>
          <select id="recurrence" name="recurrence" value={recurrence} onChange={(e) => setRecurrence(e.target.value as Recurrence)}>
            {RECURRENCES.map((r) => (
              <option key={r} value={r}>{RECURRENCE_LABELS[r]}</option>
            ))}
          </select>
        </div>

        <div className="app-form-row">
          <div className="field">
            <label htmlFor="requestedDate">Ønsket dato</label>
            <input id="requestedDate" name="requestedDate" type="date" required />
          </div>
          <div className="field">
            <label htmlFor="requestedTime">Tidspunkt</label>
            <select id="requestedTime" name="requestedTime" defaultValue="">
              <option value="">Fleksibel</option>
              {TIME_WINDOWS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="address">Adresse</label>
          <input id="address" name="address" type="text" autoComplete="street-address" defaultValue={user.adresse ?? ""} />
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

        <div className="field">
          <label htmlFor="customerNote">Bemærkning (valgfrit)</label>
          <textarea id="customerNote" name="customerNote" placeholder="Særlige ønsker, adgang, husdyr …" />
        </div>

        <div className="app-estimate">
          <span>Vejledende pris</span>
          <strong>{estimate != null ? `${kr(estimate, 5)} / besøg` : "—"}</strong>
          <small>{user.audience === "privat" ? "inkl. moms" : "ekskl. moms"} · ikke bindende</small>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? "Sender …" : "Send bookingforespørgsel"}
        </button>
      </Form>
    </div>
  );
}
