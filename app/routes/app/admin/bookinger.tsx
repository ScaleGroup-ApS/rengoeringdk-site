import { Form, useSearchParams } from "react-router";
import { desc, eq } from "drizzle-orm";
import type { Route } from "./+types/bookinger";
import { requireAdmin } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings, appUsers } from "~/db/schema";
import { cancelSeries, startOrTopUpSeries, topUpActiveSeries } from "~/lib/series.server";
import { isRecurring } from "~/lib/recurrence";
import {
  formatDanishDate,
  paymentLabel,
  recurrenceLabel,
  statusLabel,
  STATUS_LABELS,
  type BookingStatus,
} from "~/lib/bookings";

export function meta() {
  return [{ title: "Bookinger — Admin" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  // Keep recurring agreements topped up to the horizon (cron-free scheduler).
  await topUpActiveSeries();

  const db = getDb();
  const rows = await db
    .select({
      id: appBookings.id,
      service: appBookings.service,
      audience: appBookings.audience,
      status: appBookings.status,
      requestedDate: appBookings.requestedDate,
      requestedTime: appBookings.requestedTime,
      confirmedDate: appBookings.confirmedDate,
      confirmedTime: appBookings.confirmedTime,
      recurrence: appBookings.recurrence,
      seriesId: appBookings.seriesId,
      address: appBookings.address,
      postnr: appBookings.postnr,
      by: appBookings.by,
      m2: appBookings.m2,
      estimatedPrice: appBookings.estimatedPrice,
      paymentStatus: appBookings.paymentStatus,
      paidAmount: appBookings.paidAmount,
      paidAt: appBookings.paidAt,
      createdByAdmin: appBookings.createdByAdmin,
      customerNote: appBookings.customerNote,
      adminNote: appBookings.adminNote,
      createdAt: appBookings.createdAt,
      customerName: appUsers.navn,
      customerEmail: appUsers.email,
      customerPhone: appUsers.tlf,
    })
    .from(appBookings)
    .leftJoin(appUsers, eq(appBookings.userId, appUsers.id))
    .orderBy(desc(appBookings.createdAt));

  const filtered = status ? rows.filter((r) => r.status === status) : rows;
  return { bookings: filtered, status: status ?? "" };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  const id = Number(form.get("id"));
  if (!Number.isInteger(id)) return { error: "Ugyldig booking." };

  const db = getDb();
  const adminNote = String(form.get("adminNote") ?? "").trim() || null;

  if (intent === "cancel") {
    await db.update(appBookings).set({ status: "cancelled", adminNote }).where(eq(appBookings.id, id));
    return { ok: true };
  }
  if (intent === "cancel-series") {
    // Cancel this and all future occurrences of the agreement.
    const [row] = await db
      .select({ seriesId: appBookings.seriesId })
      .from(appBookings)
      .where(eq(appBookings.id, id))
      .limit(1);
    const seriesId = row?.seriesId ?? id;
    await cancelSeries(seriesId);
    return { ok: true };
  }
  if (intent === "complete") {
    await db.update(appBookings).set({ status: "completed", adminNote }).where(eq(appBookings.id, id));
    return { ok: true };
  }
  if (intent === "payment") {
    const paymentStatus = String(form.get("paymentStatus") ?? "unpaid");
    const paidRaw = Number(form.get("paidAmount"));
    const paidAmount = Number.isFinite(paidRaw) && paidRaw > 0 ? Math.round(paidRaw) : null;
    const today = new Date().toISOString().slice(0, 10);
    await db
      .update(appBookings)
      .set({
        paymentStatus,
        paidAmount,
        paidAt: paymentStatus === "paid" ? today : null,
      })
      .where(eq(appBookings.id, id));
    return { ok: true };
  }
  if (intent === "confirm" || intent === "reschedule") {
    const confirmedDate = String(form.get("confirmedDate") ?? "").trim();
    const confirmedTime = String(form.get("confirmedTime") ?? "").trim() || null;
    if (!confirmedDate) return { error: "Vælg en dato for at bekræfte." };
    await db
      .update(appBookings)
      .set({
        status: intent === "reschedule" ? "rescheduled" : "confirmed",
        confirmedDate,
        confirmedTime,
        adminNote,
      })
      .where(eq(appBookings.id, id));
    // Recurring agreement → mark as series parent and generate upcoming visits.
    const [updated] = await db
      .select({ recurrence: appBookings.recurrence })
      .from(appBookings)
      .where(eq(appBookings.id, id))
      .limit(1);
    if (updated && isRecurring(updated.recurrence)) {
      await startOrTopUpSeries(id);
    }
    return { ok: true };
  }
  return { error: "Ukendt handling." };
}

export default function AdminBookinger({ loaderData }: Route.ComponentProps) {
  const { bookings, status } = loaderData;
  const [, setParams] = useSearchParams();

  const filters: { value: string; label: string }[] = [
    { value: "", label: "Alle" },
    ...(Object.keys(STATUS_LABELS) as BookingStatus[]).map((s) => ({ value: s, label: STATUS_LABELS[s] })),
  ];

  return (
    <div className="admin-page">
      <h1 className="app-h1">Bookinger</h1>

      <div className="admin-filters">
        {filters.map((f) => (
          <button
            key={f.value || "all"}
            type="button"
            className={`admin-chip${status === f.value ? " active" : ""}`}
            onClick={() => setParams(f.value ? { status: f.value } : {})}
          >
            {f.label}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <p className="app-empty">Ingen bookinger i denne kategori.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} id={`b-${b.id}`} className="app-card admin-booking">
            <div className="admin-booking-top">
              <div>
                <p className="app-booking-service">
                  {b.service} <span className="app-meta">· {b.audience}</span>
                  {b.seriesId ? <span className="app-badge app-badge-series">Fast aftale</span> : null}
                  {b.createdByAdmin ? <span className="app-badge app-badge-manual">Oprettet af admin</span> : null}
                </p>
                <p className="app-meta">{b.customerName} · {b.customerEmail}{b.customerPhone ? ` · ${b.customerPhone}` : ""}</p>
              </div>
              <div className="admin-booking-badges">
                <span className={`app-badge status-${b.status}`}>{statusLabel(b.status)}</span>
                <span className={`app-badge pay-${b.paymentStatus}`}>{paymentLabel(b.paymentStatus)}</span>
              </div>
            </div>

            <div className="admin-booking-grid">
              <div><span className="app-meta">Ønsket</span><b>{formatDanishDate(b.requestedDate)}{b.requestedTime ? ` · ${b.requestedTime}` : ""}</b></div>
              <div><span className="app-meta">Bekræftet</span><b>{b.confirmedDate ? `${formatDanishDate(b.confirmedDate)}${b.confirmedTime ? ` · ${b.confirmedTime}` : ""}` : "—"}</b></div>
              <div><span className="app-meta">Frekvens</span><b>{recurrenceLabel(b.recurrence)}</b></div>
              <div><span className="app-meta">Areal</span><b>{b.m2 ? `${b.m2} m²` : "—"}</b></div>
              <div><span className="app-meta">Estimat</span><b>{b.estimatedPrice ? `${b.estimatedPrice.toLocaleString("da-DK")} kr.` : "—"}</b></div>
              <div><span className="app-meta">Betaling</span><b>{paymentLabel(b.paymentStatus)}{b.paidAmount ? ` · ${b.paidAmount.toLocaleString("da-DK")} kr.` : ""}</b></div>
              <div><span className="app-meta">Adresse</span><b>{[b.address, [b.postnr, b.by].filter(Boolean).join(" ")].filter(Boolean).join(", ") || "—"}</b></div>
            </div>

            {b.customerNote && <p className="admin-booking-note">Kunde: {b.customerNote}</p>}

            <details className="app-booking-edit">
              <summary>Håndtér</summary>
              <Form method="post" className="app-form app-form-tight">
                <input type="hidden" name="id" value={b.id} />
                <div className="app-form-row">
                  <div className="field">
                    <label htmlFor={`cd-${b.id}`}>Bekræft dato</label>
                    <input id={`cd-${b.id}`} name="confirmedDate" type="date" defaultValue={b.confirmedDate ? String(b.confirmedDate).slice(0, 10) : String(b.requestedDate).slice(0, 10)} />
                  </div>
                  <div className="field">
                    <label htmlFor={`ct-${b.id}`}>Tid</label>
                    <input id={`ct-${b.id}`} name="confirmedTime" type="time" defaultValue={b.confirmedTime ?? b.requestedTime ?? ""} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor={`an-${b.id}`}>Intern / kunde-besked</label>
                  <textarea id={`an-${b.id}`} name="adminNote" defaultValue={b.adminNote ?? ""} placeholder="Besked der vises til kunden …" />
                </div>
                <div className="admin-actions-row">
                  <button type="submit" name="intent" value="confirm" className="btn btn-primary btn-sm">Bekræft</button>
                  <button type="submit" name="intent" value="reschedule" className="btn btn-ghost btn-sm">Foreslå ny tid</button>
                  <button type="submit" name="intent" value="complete" className="btn btn-ghost btn-sm">Markér udført</button>
                  <button type="submit" name="intent" value="cancel" className="btn btn-ghost btn-sm app-danger">Aflys</button>
                  {isRecurring(b.recurrence) && (
                    <button type="submit" name="intent" value="cancel-series" className="btn btn-ghost btn-sm app-danger">Aflys hele aftalen</button>
                  )}
                </div>
              </Form>

              <Form method="post" className="app-form app-form-tight admin-payment-form">
                <input type="hidden" name="id" value={b.id} />
                <div className="app-form-row">
                  <div className="field">
                    <label htmlFor={`ps-${b.id}`}>Betalingsstatus</label>
                    <select id={`ps-${b.id}`} name="paymentStatus" defaultValue={b.paymentStatus}>
                      <option value="unpaid">Ikke betalt</option>
                      <option value="invoiced">Faktureret</option>
                      <option value="paid">Betalt</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor={`pa-${b.id}`}>Betalt beløb (kr.)</label>
                    <input id={`pa-${b.id}`} name="paidAmount" type="number" min={0} step={1} defaultValue={b.paidAmount ?? ""} />
                  </div>
                </div>
                <button type="submit" name="intent" value="payment" className="btn btn-ghost btn-sm">Opdatér betaling</button>
              </Form>
            </details>
          </div>
        ))
      )}
    </div>
  );
}
