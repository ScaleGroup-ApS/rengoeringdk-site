import { Form, Link, useSearchParams } from "react-router";
import { and, desc, eq } from "drizzle-orm";
import type { Route } from "./+types/bookinger";
import { requireUser } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings } from "~/db/schema";
import {
  formatDanishDate,
  isActiveBooking,
  recurrenceLabel,
  statusLabel,
} from "~/lib/bookings";
import { cancelSeries, topUpActiveSeries } from "~/lib/series.server";
import { isRecurring } from "~/lib/recurrence";

export function meta() {
  return [{ title: "Mine bookinger — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  // Keep this customer's recurring agreements topped up.
  await topUpActiveSeries(user.id);

  const db = getDb();
  const bookings = await db
    .select()
    .from(appBookings)
    .where(eq(appBookings.userId, user.id))
    .orderBy(desc(appBookings.createdAt));
  const today = new Date().toISOString().slice(0, 10);
  return { bookings, today };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  const id = Number(form.get("id"));
  if (!Number.isInteger(id)) return { error: "Ugyldig booking." };

  const db = getDb();
  // Scope every mutation to the current user's own bookings.
  const owned = await db
    .select({ id: appBookings.id })
    .from(appBookings)
    .where(and(eq(appBookings.id, id), eq(appBookings.userId, user.id)))
    .limit(1);
  if (owned.length === 0) return { error: "Booking ikke fundet." };

  if (intent === "cancel") {
    await db
      .update(appBookings)
      .set({ status: "cancelled" })
      .where(and(eq(appBookings.id, id), eq(appBookings.userId, user.id)));
    return { ok: true };
  }

  if (intent === "cancel-series") {
    const [row] = await db
      .select({ seriesId: appBookings.seriesId })
      .from(appBookings)
      .where(and(eq(appBookings.id, id), eq(appBookings.userId, user.id)))
      .limit(1);
    await cancelSeries(row?.seriesId ?? id, user.id);
    return { ok: true };
  }

  if (intent === "change") {
    const note = String(form.get("customerNote") ?? "").trim() || null;
    const newDate = String(form.get("requestedDate") ?? "").trim();
    const patch: Record<string, unknown> = { status: "requested", customerNote: note };
    if (newDate) patch.requestedDate = newDate;
    await db
      .update(appBookings)
      .set(patch)
      .where(and(eq(appBookings.id, id), eq(appBookings.userId, user.id)));
    return { ok: true };
  }

  return { error: "Ukendt handling." };
}

type BookingRow = Route.ComponentProps["loaderData"]["bookings"][number];

export default function MineBookinger({ loaderData }: Route.ComponentProps) {
  const { bookings, today } = loaderData;
  const [params] = useSearchParams();
  const justBooked = params.get("ny") === "1";

  // Split into recurring agreements (series) and one-off bookings.
  const singles = bookings.filter((b) => b.seriesId == null);
  const seriesMap = new Map<number, BookingRow[]>();
  for (const b of bookings) {
    if (b.seriesId != null) {
      const list = seriesMap.get(b.seriesId) ?? [];
      list.push(b);
      seriesMap.set(b.seriesId, list);
    }
  }

  const activeSingles = singles.filter((b) => isActiveBooking(b.status));
  const pastSingles = singles.filter((b) => !isActiveBooking(b.status));

  const series = [...seriesMap.values()].map((occ) => {
    const upcoming = occ
      .filter((o) => isActiveBooking(o.status) && (o.confirmedDate ?? o.requestedDate) >= today)
      .sort((a, b) => String(a.confirmedDate ?? a.requestedDate).localeCompare(String(b.confirmedDate ?? b.requestedDate)));
    const completed = occ.filter((o) => o.status === "completed").length;
    return { occ, upcoming, completed };
  });
  const activeSeries = series.filter((s) => s.upcoming.length > 0);

  const hasNothing = bookings.length === 0;

  return (
    <div className="app-page">
      <div className="app-head-row">
        <h1 className="app-h1">Mine bookinger</h1>
        <Link to="/app/book" className="btn btn-primary btn-sm">+ Book ny</Link>
      </div>

      {justBooked && (
        <p className="app-success">Tak! Din forespørgsel er sendt — vi bekræfter tiden hurtigst muligt.</p>
      )}

      {hasNothing ? (
        <div className="app-card app-empty-card">
          <p className="app-empty">Du har ingen bookinger endnu.</p>
          <Link to="/app/book" className="btn btn-primary">Book din første rengøring</Link>
        </div>
      ) : (
        <>
          {activeSeries.length > 0 && (
            <>
              <h2 className="app-h2">Faste aftaler</h2>
              {activeSeries.map((s) => (
                <SeriesCard key={s.occ[0].seriesId} upcoming={s.upcoming} completed={s.completed} />
              ))}
            </>
          )}

          {activeSingles.length > 0 && (
            <>
              <h2 className="app-h2 app-section-gap">Enkelt-bookinger</h2>
              {activeSingles.map((b) => (
                <BookingCard key={b.id} b={b} editable />
              ))}
            </>
          )}

          {pastSingles.length > 0 && (
            <>
              <h2 className="app-h2 app-section-gap">Tidligere</h2>
              {pastSingles.map((b) => (
                <BookingCard key={b.id} b={b} editable={false} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

function SeriesCard({ upcoming, completed }: { upcoming: BookingRow[]; completed: number }) {
  const next = upcoming[0];
  const rest = upcoming.slice(1);
  return (
    <div className="app-card app-booking">
      <div className="app-booking-head">
        <div>
          <p className="app-booking-service">
            {next.service} <span className="app-badge app-badge-series">Fast aftale</span>
          </p>
          <p className="app-booking-date">
            Næste: {formatDanishDate(next.confirmedDate ?? next.requestedDate)}
            {(next.confirmedTime ?? next.requestedTime) && ` · kl. ${next.confirmedTime ?? next.requestedTime}`}
          </p>
        </div>
        <span className={`app-badge status-${next.status}`}>{statusLabel(next.status)}</span>
      </div>

      <div className="app-booking-meta">
        <span>{recurrenceLabel(next.recurrence)}</span>
        <span>{upcoming.length} kommende</span>
        {completed > 0 ? <span>{completed} gennemført</span> : null}
        {next.estimatedPrice ? <span>≈ {next.estimatedPrice.toLocaleString("da-DK")} kr./besøg</span> : null}
      </div>

      <details className="app-booking-edit">
        <summary>Se alle besøg &amp; aflys</summary>
        <ul className="app-series-list">
          {upcoming.map((o) => (
            <li key={o.id}>
              <span>{formatDanishDate(o.confirmedDate ?? o.requestedDate)}{(o.confirmedTime ?? o.requestedTime) ? ` · ${o.confirmedTime ?? o.requestedTime}` : ""}</span>
              <Form method="post">
                <input type="hidden" name="id" value={o.id} />
                <button type="submit" name="intent" value="cancel" className="app-linkbtn app-danger">Aflys</button>
              </Form>
            </li>
          ))}
        </ul>
        <Form method="post" className="app-form-tight">
          <input type="hidden" name="id" value={next.id} />
          <button type="submit" name="intent" value="cancel-series" className="btn btn-ghost btn-sm app-danger">Aflys hele aftalen</button>
        </Form>
      </details>
    </div>
  );
}

function BookingCard({ b, editable }: { b: BookingRow; editable: boolean }) {
  const dateShown = b.confirmedDate ?? b.requestedDate;
  const timeShown = b.confirmedTime ?? b.requestedTime;

  return (
    <div className="app-card app-booking">
      <div className="app-booking-head">
        <div>
          <p className="app-booking-service">{b.service}</p>
          <p className="app-booking-date">
            {formatDanishDate(dateShown)}{timeShown && ` · kl. ${timeShown}`}
          </p>
        </div>
        <span className={`app-badge status-${b.status}`}>{statusLabel(b.status)}</span>
      </div>

      <div className="app-booking-meta">
        <span>{recurrenceLabel(b.recurrence)}</span>
        {b.m2 ? <span>{b.m2} m²</span> : null}
        {b.estimatedPrice ? <span>≈ {b.estimatedPrice.toLocaleString("da-DK")} kr./besøg</span> : null}
      </div>

      {b.adminNote && <p className="app-booking-adminnote">💬 {b.adminNote}</p>}

      {editable && (
        <details className="app-booking-edit">
          <summary>Ret eller aflys</summary>
          <Form method="post" className="app-form app-form-tight">
            <input type="hidden" name="id" value={b.id} />
            <div className="field">
              <label htmlFor={`date-${b.id}`}>Foreslå ny dato (valgfrit)</label>
              <input id={`date-${b.id}`} name="requestedDate" type="date" />
            </div>
            <div className="field">
              <label htmlFor={`note-${b.id}`}>Besked til os</label>
              <textarea id={`note-${b.id}`} name="customerNote" defaultValue={b.customerNote ?? ""} placeholder="Hvad vil du ændre?" />
            </div>
            <div className="app-form-row">
              <button type="submit" name="intent" value="change" className="btn btn-primary btn-sm">Send ændring</button>
              <button type="submit" name="intent" value="cancel" className="btn btn-ghost btn-sm app-danger" formNoValidate>Aflys booking</button>
            </div>
          </Form>
        </details>
      )}
    </div>
  );
}
