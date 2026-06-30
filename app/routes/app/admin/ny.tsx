import { useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { asc, eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import type { Route } from "./+types/ny";
import { requireAdmin } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings, appUsers } from "~/db/schema";
import { hashPassword } from "~/lib/auth/password.server";
import { getPricingConfig } from "~/lib/pricing.server";
import { startOrTopUpSeries } from "~/lib/series.server";
import { isRecurring } from "~/lib/recurrence";
import { RECURRENCE_LABELS, type Recurrence } from "~/lib/bookings";

export function meta() {
  return [{ title: "Ny aftale — Admin" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const db = getDb();
  const [customers, pricing] = await Promise.all([
    db
      .select({
        id: appUsers.id,
        navn: appUsers.navn,
        email: appUsers.email,
        virksomhed: appUsers.virksomhed,
        audience: appUsers.audience,
      })
      .from(appUsers)
      .where(eq(appUsers.role, "customer"))
      .orderBy(asc(appUsers.navn)),
    getPricingConfig(),
  ]);
  const serviceNames = [
    ...new Set([...pricing.privat.propertyTypes, ...pricing.erhverv.propertyTypes].map((p) => p.name)),
  ];
  return { customers, serviceNames };
}

const RECURRENCES: Recurrence[] = ["once", "weekly", "biweekly", "monthly"];

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const form = await request.formData();
  const db = getDb();

  const mode = String(form.get("customerMode") ?? "existing");
  const service = String(form.get("service") ?? "").trim();
  const confirmedDate = String(form.get("confirmedDate") ?? "").trim();
  const confirmedTime = String(form.get("confirmedTime") ?? "").trim() || null;
  const recurrence = String(form.get("recurrence") ?? "once").trim();
  const m2raw = Number(form.get("m2"));
  const m2 = Number.isFinite(m2raw) && m2raw > 0 ? Math.round(m2raw) : null;
  const estRaw = Number(form.get("estimatedPrice"));
  const estimatedPrice = Number.isFinite(estRaw) && estRaw > 0 ? Math.round(estRaw) : null;
  const address = String(form.get("address") ?? "").trim() || null;
  const postnr = String(form.get("postnr") ?? "").trim() || null;
  const by = String(form.get("by") ?? "").trim() || null;
  const adminNote = String(form.get("adminNote") ?? "").trim() || null;
  const paymentStatus = String(form.get("paymentStatus") ?? "unpaid");

  if (!service || !confirmedDate) {
    return { error: "Udfyld venligst ydelse og dato." };
  }

  let userId: number;
  let audience: string;

  if (mode === "new") {
    const navn = String(form.get("newNavn") ?? "").trim();
    const email = String(form.get("newEmail") ?? "").trim().toLowerCase();
    const tlf = String(form.get("newTlf") ?? "").trim() || null;
    audience = String(form.get("newAudience") ?? "privat") === "erhverv" ? "erhverv" : "privat";
    if (!navn || !email) return { error: "Ny kunde kræver navn og e-mail." };

    const existing = await db.select({ id: appUsers.id }).from(appUsers).where(eq(appUsers.email, email)).limit(1);
    if (existing.length > 0) {
      return { error: "Der findes allerede en kunde med denne e-mail — vælg dem i listen i stedet." };
    }
    // Random unusable password — the customer sets their own later via registrering.
    const passwordHash = await hashPassword(randomBytes(24).toString("hex"));
    const [res] = await db.insert(appUsers).values({
      email,
      passwordHash,
      role: "customer",
      navn,
      tlf,
      audience,
      adresse: address,
      postnr,
      by,
    });
    userId = (res as { insertId: number }).insertId;
  } else {
    userId = Number(form.get("userId"));
    if (!Number.isInteger(userId)) return { error: "Vælg en kunde." };
    const [u] = await db.select({ audience: appUsers.audience }).from(appUsers).where(eq(appUsers.id, userId)).limit(1);
    if (!u) return { error: "Kunden blev ikke fundet." };
    audience = u.audience === "erhverv" ? "erhverv" : "privat";
  }

  const [res] = await db.insert(appBookings).values({
    userId,
    status: "confirmed",
    service,
    audience,
    requestedDate: confirmedDate,
    confirmedDate,
    confirmedTime,
    recurrence,
    address,
    postnr,
    by,
    m2,
    estimatedPrice,
    paymentStatus,
    paidAmount: paymentStatus === "paid" ? estimatedPrice : null,
    paidAt: paymentStatus === "paid" ? confirmedDate : null,
    createdByAdmin: 1,
    adminNote,
  });
  const bookingId = (res as { insertId: number }).insertId;

  if (isRecurring(recurrence)) {
    await startOrTopUpSeries(bookingId);
  }

  return redirect("/app/admin/bookinger");
}

export default function NyAftale({ loaderData, actionData }: Route.ComponentProps) {
  const { customers, serviceNames } = loaderData;
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [mode, setMode] = useState<"existing" | "new">(customers.length > 0 ? "existing" : "new");

  return (
    <div className="admin-page">
      <div className="admin-pagehead">
        <h1 className="app-h1">Ny aftale</h1>
        <Link to="/app/admin/bookinger" className="admin-link">← Tilbage</Link>
      </div>
      <p className="app-sub">Opret en booking manuelt for en kunde. Den oprettes som bekræftet.</p>

      {actionData?.error && <p className="app-alert">{actionData.error}</p>}

      <Form method="post" className="app-form app-card" noValidate>
        <div className="app-seg" role="tablist" aria-label="Kunde">
          <button type="button" className={mode === "existing" ? "sel" : ""} onClick={() => setMode("existing")} disabled={customers.length === 0}>Eksisterende kunde</button>
          <button type="button" className={mode === "new" ? "sel" : ""} onClick={() => setMode("new")}>Ny kunde</button>
        </div>
        <input type="hidden" name="customerMode" value={mode} />

        {mode === "existing" ? (
          <div className="field">
            <label htmlFor="userId">Kunde</label>
            <select id="userId" name="userId" defaultValue="">
              <option value="" disabled>Vælg kunde …</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.navn}{c.virksomhed ? ` (${c.virksomhed})` : ""} — {c.email}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="app-form-row">
              <div className="field">
                <label htmlFor="newNavn">Navn</label>
                <input id="newNavn" name="newNavn" type="text" />
              </div>
              <div className="field">
                <label htmlFor="newAudience">Type</label>
                <select id="newAudience" name="newAudience" defaultValue="privat">
                  <option value="privat">Privat</option>
                  <option value="erhverv">Erhverv</option>
                </select>
              </div>
            </div>
            <div className="app-form-row">
              <div className="field">
                <label htmlFor="newEmail">E-mail</label>
                <input id="newEmail" name="newEmail" type="email" />
              </div>
              <div className="field">
                <label htmlFor="newTlf">Telefon</label>
                <input id="newTlf" name="newTlf" type="tel" />
              </div>
            </div>
          </>
        )}

        <div className="field">
          <label htmlFor="service">Ydelse</label>
          <input id="service" name="service" type="text" list="service-options" placeholder="fx Kontor, Lejlighed …" />
          <datalist id="service-options">
            {serviceNames.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>

        <div className="app-form-row">
          <div className="field">
            <label htmlFor="confirmedDate">Dato</label>
            <input id="confirmedDate" name="confirmedDate" type="date" />
          </div>
          <div className="field">
            <label htmlFor="confirmedTime">Tid</label>
            <input id="confirmedTime" name="confirmedTime" type="time" />
          </div>
        </div>

        <div className="app-form-row">
          <div className="field">
            <label htmlFor="recurrence">Frekvens</label>
            <select id="recurrence" name="recurrence" defaultValue="once">
              {RECURRENCES.map((r) => <option key={r} value={r}>{RECURRENCE_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="m2">Areal (m²)</label>
            <input id="m2" name="m2" type="number" min={0} step={1} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="address">Adresse</label>
          <input id="address" name="address" type="text" autoComplete="off" />
        </div>
        <div className="app-form-row">
          <div className="field">
            <label htmlFor="postnr">Postnr.</label>
            <input id="postnr" name="postnr" type="text" inputMode="numeric" />
          </div>
          <div className="field">
            <label htmlFor="by">By</label>
            <input id="by" name="by" type="text" />
          </div>
        </div>

        <div className="app-form-row">
          <div className="field">
            <label htmlFor="estimatedPrice">Pris pr. besøg (kr.)</label>
            <input id="estimatedPrice" name="estimatedPrice" type="number" min={0} step={1} />
          </div>
          <div className="field">
            <label htmlFor="paymentStatus">Betaling</label>
            <select id="paymentStatus" name="paymentStatus" defaultValue="unpaid">
              <option value="unpaid">Ikke betalt</option>
              <option value="invoiced">Faktureret</option>
              <option value="paid">Betalt</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="adminNote">Note</label>
          <textarea id="adminNote" name="adminNote" placeholder="Intern note eller besked til kunden …" />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? "Opretter …" : "Opret aftale"}
        </button>
      </Form>
    </div>
  );
}
