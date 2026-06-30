import { Link, useSearchParams } from "react-router";
import { desc, eq } from "drizzle-orm";
import type { Route } from "./+types/kvittering";
import { requireUser } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings } from "~/db/schema";
import { formatDanishDate } from "~/lib/bookings";
import { topUpActiveSeries } from "~/lib/series.server";
import {
  estimateServicefradrag,
  formatKr,
  isDelivered,
  MOMS_RATE,
  SERVICEFRADRAG_RATE,
  yearOf,
} from "~/lib/servicefradrag";

export function meta() {
  return [{ title: "Kvittering & servicefradrag — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  await topUpActiveSeries(user.id);
  const db = getDb();

  const rows = await db
    .select({
      id: appBookings.id,
      service: appBookings.service,
      status: appBookings.status,
      requestedDate: appBookings.requestedDate,
      confirmedDate: appBookings.confirmedDate,
      estimatedPrice: appBookings.estimatedPrice,
    })
    .from(appBookings)
    .where(eq(appBookings.userId, user.id))
    .orderBy(desc(appBookings.confirmedDate));

  const today = new Date().toISOString().slice(0, 10);

  // Delivered visits only, each with its visit date and amount.
  const delivered = rows
    .map((r) => ({
      id: r.id,
      service: r.service,
      date: r.confirmedDate ?? r.requestedDate,
      amount: r.estimatedPrice ?? 0,
      status: r.status,
    }))
    .filter((r) => r.date && isDelivered(r.status, r.date, today))
    .sort((a, b) => b.date.localeCompare(a.date));

  const years = [...new Set(delivered.map((d) => yearOf(d.date)))].sort((a, b) => b - a);
  const requestedYear = Number(new URL(request.url).searchParams.get("aar"));
  const year = years.includes(requestedYear) ? requestedYear : years[0] ?? new Date().getUTCFullYear();

  const items = delivered.filter((d) => yearOf(d.date) === year);
  const total = items.reduce((s, d) => s + d.amount, 0);

  return {
    audience: user.audience,
    customer: { navn: user.navn, virksomhed: user.virksomhed, adresse: user.adresse, postnr: user.postnr, by: user.by, email: user.email },
    years,
    year,
    items,
    total,
  };
}

export default function Kvittering({ loaderData }: Route.ComponentProps) {
  const { audience, customer, years, year, items, total } = loaderData;
  const [, setParams] = useSearchParams();

  const fradrag = estimateServicefradrag(total);
  const moms = Math.round(total * MOMS_RATE);

  return (
    <div className="app-page">
      <div className="app-head-row no-print">
        <h1 className="app-h1">Kvittering &amp; fradrag</h1>
        {items.length > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            Print / gem som PDF
          </button>
        )}
      </div>

      {years.length > 1 && (
        <div className="admin-filters no-print">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={`admin-chip${y === year ? " active" : ""}`}
              onClick={() => setParams({ aar: String(y) })}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <div className="app-card app-empty-card">
          <p className="app-empty">Der er endnu ingen gennemførte besøg at vise her.</p>
          <Link to="/app/book" className="btn btn-primary">Book rengøring</Link>
        </div>
      ) : (
        <div className="app-card receipt">
          <div className="receipt-head">
            <img src="/logo.png" alt="Define Cleaning" className="receipt-logo" />
            <div className="receipt-meta">
              <strong>Define Cleaning A/S</strong>
              <span>CVR DK40681086</span>
              <span>info@define-cleaning.dk</span>
            </div>
          </div>

          <div className="receipt-parties">
            <div>
              <p className="app-eyebrow">Kunde</p>
              <strong>{customer.virksomhed || customer.navn}</strong>
              {customer.virksomhed && <div>{customer.navn}</div>}
              {customer.adresse && <div>{customer.adresse}</div>}
              {(customer.postnr || customer.by) && <div>{[customer.postnr, customer.by].filter(Boolean).join(" ")}</div>}
              <div>{customer.email}</div>
            </div>
            <div className="receipt-period">
              <p className="app-eyebrow">Periode</p>
              <strong>Året {year}</strong>
              <div>{items.length} besøg</div>
            </div>
          </div>

          <table className="receipt-table">
            <thead>
              <tr><th>Dato</th><th>Ydelse</th><th className="num">Beløb</th></tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td>{formatDanishDate(d.date)}</td>
                  <td>{d.service}</td>
                  <td className="num">{formatKr(d.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>I alt {audience === "privat" ? "(inkl. moms)" : "(ekskl. moms)"}</td>
                <td className="num">{formatKr(total)}</td>
              </tr>
              {audience === "erhverv" && (
                <>
                  <tr><td colSpan={2}>Moms (25%)</td><td className="num">{formatKr(moms)}</td></tr>
                  <tr className="receipt-grand"><td colSpan={2}>I alt inkl. moms</td><td className="num">{formatKr(total + moms)}</td></tr>
                </>
              )}
            </tfoot>
          </table>

          {audience === "privat" ? (
            <div className="receipt-fradrag">
              <p className="app-eyebrow">Servicefradrag {year}</p>
              <p className="receipt-fradrag-num">≈ {formatKr(fradrag)}</p>
              <p className="app-meta">
                Vejledende estimat: ca. {Math.round(SERVICEFRADRAG_RATE * 100)}% af beløbet kan typisk trækkes fra
                som servicefradrag. Du indberetter selv via din årsopgørelse på skat.dk — op til årets loft.
                Beløbene er estimater fra prisberegneren; brug dine faktiske fakturaer ved indberetning.
              </p>
            </div>
          ) : (
            <p className="app-meta receipt-note">
              Oversigt til bogføring. Beløb er estimater fra prisberegneren — de endelige tal fremgår af dine fakturaer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
