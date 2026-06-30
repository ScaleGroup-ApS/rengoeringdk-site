import { Link } from "react-router";
import { count, desc, eq, sql } from "drizzle-orm";
import type { Route } from "./+types/index";
import { requireAdmin } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings, appUsers } from "~/db/schema";
import { formatDanishDate, statusLabel } from "~/lib/bookings";

export function meta() {
  return [{ title: "Dashboard — Admin" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const db = getDb();

  const [[customers], statusRows, recent] = await Promise.all([
    db
      .select({ n: count() })
      .from(appUsers)
      .where(eq(appUsers.role, "customer")),
    db
      .select({ status: appBookings.status, n: count() })
      .from(appBookings)
      .groupBy(appBookings.status),
    db
      .select({
        id: appBookings.id,
        service: appBookings.service,
        status: appBookings.status,
        requestedDate: appBookings.requestedDate,
        confirmedDate: appBookings.confirmedDate,
        createdAt: appBookings.createdAt,
        estimatedPrice: appBookings.estimatedPrice,
        customerName: appUsers.navn,
      })
      .from(appBookings)
      .leftJoin(appUsers, eq(appBookings.userId, appUsers.id))
      .orderBy(desc(appBookings.createdAt))
      .limit(8),
  ]);

  const byStatus = Object.fromEntries(statusRows.map((r) => [r.status, Number(r.n)]));
  const totalBookings = statusRows.reduce((s, r) => s + Number(r.n), 0);
  // Rough monthly run-rate: sum of estimates for active (confirmed/rescheduled) bookings.
  const [[pipeline]] = await Promise.all([
    db
      .select({ total: sql<number>`COALESCE(SUM(${appBookings.estimatedPrice}), 0)` })
      .from(appBookings)
      .where(sql`${appBookings.status} IN ('confirmed','rescheduled')`),
  ]);

  return {
    customers: Number(customers?.n ?? 0),
    byStatus,
    totalBookings,
    pipeline: Number(pipeline?.total ?? 0),
    recent,
  };
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const { customers, byStatus, totalBookings, pipeline, recent } = loaderData;

  const cards = [
    { label: "Kunder", value: customers, hint: "registrerede konti", to: "/app/admin/kunder", accent: true },
    { label: "Afventer svar", value: byStatus.requested ?? 0, hint: "nye forespørgsler", to: "/app/admin/bookinger?status=requested" },
    { label: "Bekræftede", value: (byStatus.confirmed ?? 0) + (byStatus.rescheduled ?? 0), hint: "aktive aftaler", to: "/app/admin/bookinger?status=confirmed" },
    { label: "Bookinger i alt", value: totalBookings, hint: "alle tider", to: "/app/admin/bookinger" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-pagehead">
        <div>
          <h1 className="app-h1">Dashboard</h1>
          <p className="app-sub">Overblik over kunder, bookinger og aktivitet.</p>
        </div>
        <Link to="/app/admin/priser" className="btn btn-ghost btn-sm">Redigér priser</Link>
      </div>

      <div className="admin-cards">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className={`admin-metric${c.accent ? " accent" : ""}`}>
            <span className="admin-metric-num">{c.value.toLocaleString("da-DK")}</span>
            <span className="admin-metric-lbl">{c.label}</span>
            <span className="admin-metric-hint">{c.hint}</span>
          </Link>
        ))}
      </div>

      <div className="admin-pipeline app-card">
        <div>
          <p className="app-eyebrow">Estimeret omsætning · aktive aftaler</p>
          <p className="admin-pipeline-num">{pipeline.toLocaleString("da-DK")} kr. <small>/ besøg</small></p>
        </div>
        <p className="app-meta">Sum af estimater på bekræftede &amp; omlagte bookinger.</p>
      </div>

      <div className="app-card">
        <div className="admin-tablehead">
          <h2 className="app-h2">Seneste aktivitet</h2>
          <Link to="/app/admin/bookinger" className="admin-link">Se alle →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="app-empty">Ingen bookinger endnu.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Kunde</th><th>Ydelse</th><th>Dato</th><th>Status</th><th>Estimat</th></tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td>{r.customerName ?? "—"}</td>
                    <td>{r.service}</td>
                    <td>{formatDanishDate(r.confirmedDate ?? r.requestedDate)}</td>
                    <td><span className={`app-badge status-${r.status}`}>{statusLabel(r.status)}</span></td>
                    <td>{r.estimatedPrice ? `${r.estimatedPrice.toLocaleString("da-DK")} kr.` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
