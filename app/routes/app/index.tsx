import { Link, redirect } from "react-router";
import { and, desc, eq } from "drizzle-orm";
import type { Route } from "./+types/index";
import { requireUser } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings } from "~/db/schema";
import { topUpActiveSeries } from "~/lib/series.server";
import {
  formatDanishDate,
  isActiveBooking,
  recurrenceLabel,
  statusLabel,
} from "~/lib/bookings";

export function meta() {
  return [{ title: "Overblik — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  if (user.role === "admin") throw redirect("/app/admin");
  await topUpActiveSeries(user.id);

  const db = getDb();
  const bookings = await db
    .select()
    .from(appBookings)
    .where(eq(appBookings.userId, user.id))
    .orderBy(desc(appBookings.createdAt));

  const active = bookings.filter((b) => isActiveBooking(b.status));
  const next = active
    .filter((b) => b.status === "confirmed" || b.status === "rescheduled")
    .sort((a, b) => String(a.confirmedDate ?? a.requestedDate).localeCompare(String(b.confirmedDate ?? b.requestedDate)))[0];

  return {
    user,
    stats: {
      active: active.length,
      total: bookings.length,
      awaiting: bookings.filter((b) => b.status === "requested").length,
    },
    next: next ?? null,
  };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, stats, next } = loaderData;

  return (
    <div className="app-page">
      <div className="app-greet">
        <p className="app-eyebrow">Min side</p>
        <h1 className="app-h1">Hej {user.navn.split(" ")[0]} 👋</h1>
        <p className="app-sub">Her er overblikket over din rengøring.</p>
      </div>

      <div className="app-stats">
        <div className="app-stat">
          <span className="app-stat-num">{stats.active}</span>
          <span className="app-stat-lbl">Aktive aftaler</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-num">{stats.awaiting}</span>
          <span className="app-stat-lbl">Afventer svar</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-num">{stats.total}</span>
          <span className="app-stat-lbl">I alt</span>
        </div>
      </div>

      <div className="app-card app-next">
        <h2 className="app-h2">Næste besøg</h2>
        {next ? (
          <div className="app-next-body">
            <div>
              <p className="app-next-service">{next.service}</p>
              <p className="app-next-date">
                {formatDanishDate(next.confirmedDate ?? next.requestedDate)}
                {(next.confirmedTime ?? next.requestedTime) && ` · kl. ${next.confirmedTime ?? next.requestedTime}`}
              </p>
              <p className="app-meta">{recurrenceLabel(next.recurrence)}</p>
            </div>
            <span className={`app-badge status-${next.status}`}>{statusLabel(next.status)}</span>
          </div>
        ) : (
          <p className="app-empty">Du har ingen kommende besøg endnu.</p>
        )}
      </div>

      <div className="app-actions">
        <Link to="/app/book" className="btn btn-primary btn-lg">Book ny rengøring</Link>
        <Link to="/app/bookinger" className="btn btn-ghost btn-lg">Se alle bookinger</Link>
      </div>

      <Link to="/app/kvittering" className="app-card app-quicklink">
        <div>
          <p className="app-quicklink-title">Kvittering &amp; servicefradrag</p>
          <p className="app-meta">Se din årsoversigt og estimeret fradrag — klar til skat.dk.</p>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
      </Link>
    </div>
  );
}
