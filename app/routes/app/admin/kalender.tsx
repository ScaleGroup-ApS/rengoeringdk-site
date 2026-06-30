import { Link } from "react-router";
import { eq, ne } from "drizzle-orm";
import type { Route } from "./+types/kalender";
import { requireAdmin } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings, appUsers } from "~/db/schema";
import { topUpActiveSeries } from "~/lib/series.server";

export function meta() {
  return [{ title: "Kalender — Admin" }, { name: "robots", content: "noindex" }];
}

const WEEKDAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function shiftMonth(month: string, delta: number): string {
  let [y, m] = month.split("-").map(Number);
  m += delta;
  while (m < 1) { m += 12; y -= 1; }
  while (m > 12) { m -= 12; y += 1; }
  return `${y}-${String(m).padStart(2, "0")}`;
}

function fullAddress(b: { address: string | null; postnr: string | null; by: string | null }): string {
  return [b.address, [b.postnr, b.by].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  await topUpActiveSeries();

  const url = new URL(request.url);
  const param = url.searchParams.get("m") ?? "";
  const today = iso(new Date());
  const month = /^\d{4}-\d{2}$/.test(param) ? param : today.slice(0, 7);
  const [y, m] = month.split("-").map(Number);

  // Build a 6×7 grid, Monday-first.
  const first = new Date(Date.UTC(y, m - 1, 1));
  const firstWeekday = (first.getUTCDay() + 6) % 7; // Mon=0
  const gridStart = new Date(first);
  gridStart.setUTCDate(1 - firstWeekday);
  const cells: string[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setUTCDate(gridStart.getUTCDate() + i);
    cells.push(iso(d));
  }
  const rangeStart = cells[0];
  const rangeEnd = cells[41];

  const db = getDb();
  const rows = await db
    .select({
      id: appBookings.id,
      service: appBookings.service,
      status: appBookings.status,
      paymentStatus: appBookings.paymentStatus,
      requestedDate: appBookings.requestedDate,
      confirmedDate: appBookings.confirmedDate,
      requestedTime: appBookings.requestedTime,
      confirmedTime: appBookings.confirmedTime,
      address: appBookings.address,
      postnr: appBookings.postnr,
      by: appBookings.by,
      customerName: appUsers.navn,
    })
    .from(appBookings)
    .leftJoin(appUsers, eq(appBookings.userId, appUsers.id))
    .where(ne(appBookings.status, "cancelled"));

  // Group bookings onto their visit date within the visible range.
  const byDate = new Map<string, typeof rows>();
  for (const r of rows) {
    const date = (r.confirmedDate ?? r.requestedDate) as string;
    if (!date || date < rangeStart || date > rangeEnd) continue;
    const list = byDate.get(date) ?? [];
    list.push(r);
    byDate.set(date, list);
  }

  const weeks: {
    date: string;
    day: number;
    inMonth: boolean;
    isToday: boolean;
    bookings: typeof rows;
    routeUrl: string | null;
  }[][] = [];
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = cells[w * 7 + d];
      const list = (byDate.get(date) ?? []).slice().sort((a, b) =>
        String(a.confirmedTime ?? a.requestedTime ?? "").localeCompare(String(b.confirmedTime ?? b.requestedTime ?? "")),
      );
      const addrs = list.map(fullAddress).filter(Boolean);
      const routeUrl =
        addrs.length > 0
          ? "https://www.google.com/maps/dir/" + addrs.map((a) => encodeURIComponent(a)).join("/")
          : null;
      week.push({
        date,
        day: Number(date.slice(8, 10)),
        inMonth: date.slice(0, 7) === month,
        isToday: date === today,
        bookings: list,
        routeUrl,
      });
    }
    weeks.push(week);
  }

  const monthLabel = first.toLocaleDateString("da-DK", { month: "long", year: "numeric", timeZone: "UTC" });

  return { month, monthLabel, weeks, prevMonth: shiftMonth(month, -1), nextMonth: shiftMonth(month, 1) };
}

export default function Kalender({ loaderData }: Route.ComponentProps) {
  const { month, monthLabel, weeks, prevMonth, nextMonth } = loaderData;

  return (
    <div className="admin-page">
      <div className="admin-pagehead">
        <h1 className="app-h1">Kalender</h1>
        <Link to="/app/admin/ny" className="btn btn-primary btn-sm">+ Ny aftale</Link>
      </div>

      <div className="cal-nav">
        <Link to={`?m=${prevMonth}`} className="btn btn-ghost btn-sm" aria-label="Forrige måned">←</Link>
        <strong className="cal-month">{monthLabel}</strong>
        <Link to={`?m=${nextMonth}`} className="btn btn-ghost btn-sm" aria-label="Næste måned">→</Link>
        {month !== new Date().toISOString().slice(0, 7) && (
          <Link to="/app/admin/kalender" className="admin-link cal-today">I dag</Link>
        )}
      </div>

      <div className="cal-wrap">
        <div className="cal-grid">
          {WEEKDAYS.map((w) => (
            <div key={w} className="cal-weekday">{w}</div>
          ))}
          {weeks.flat().map((cell) => (
            <div key={cell.date} className={`cal-cell${cell.inMonth ? "" : " out"}${cell.isToday ? " today" : ""}`}>
              <div className="cal-daynum">
                <span>{cell.day}</span>
                {cell.routeUrl && (
                  <a href={cell.routeUrl} target="_blank" rel="noreferrer" className="cal-route" title="Åbn dagens rute i Google Maps">Rute ↗</a>
                )}
              </div>
              <div className="cal-events">
                {cell.bookings.map((b) => (
                  <Link
                    key={b.id}
                    to={`/app/admin/bookinger#b-${b.id}`}
                    className={`cal-event status-${b.status} pay-dot-${b.paymentStatus}`}
                    title={`${b.service} · ${b.customerName ?? ""}${fullAddress(b) ? ` · ${fullAddress(b)}` : ""}`}
                  >
                    {(b.confirmedTime ?? b.requestedTime) && <span className="cal-event-time">{b.confirmedTime ?? b.requestedTime}</span>}
                    <span className="cal-event-txt">{b.service}{b.customerName ? ` · ${b.customerName.split(" ")[0]}` : ""}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="app-meta cal-legend">Klik på en aftale for at håndtere den · “Rute” åbner dagens adresser i Google Maps.</p>
    </div>
  );
}
