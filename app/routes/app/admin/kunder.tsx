import { count, desc, eq } from "drizzle-orm";
import type { Route } from "./+types/kunder";
import { requireAdmin } from "~/lib/auth/guards.server";
import { getDb } from "~/lib/db.server";
import { appBookings, appUsers } from "~/db/schema";
import { formatDanishDate } from "~/lib/bookings";

export function meta() {
  return [{ title: "Kunder — Admin" }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const db = getDb();

  const [users, bookingCounts] = await Promise.all([
    db
      .select({
        id: appUsers.id,
        navn: appUsers.navn,
        email: appUsers.email,
        tlf: appUsers.tlf,
        virksomhed: appUsers.virksomhed,
        audience: appUsers.audience,
        by: appUsers.by,
        createdAt: appUsers.createdAt,
      })
      .from(appUsers)
      .where(eq(appUsers.role, "customer"))
      .orderBy(desc(appUsers.createdAt)),
    db
      .select({ userId: appBookings.userId, n: count() })
      .from(appBookings)
      .groupBy(appBookings.userId),
  ]);

  const counts = new Map(bookingCounts.map((r) => [r.userId, Number(r.n)]));
  const customers = users.map((u) => ({ ...u, bookings: counts.get(u.id) ?? 0 }));

  return { customers, total: customers.length };
}

export default function AdminKunder({ loaderData }: Route.ComponentProps) {
  const { customers, total } = loaderData;

  return (
    <div className="admin-page">
      <div className="admin-pagehead">
        <div>
          <h1 className="app-h1">Kunder</h1>
          <p className="app-sub">{total.toLocaleString("da-DK")} registrerede {total === 1 ? "kunde" : "kunder"}.</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <p className="app-empty">Ingen kunder endnu.</p>
      ) : (
        <div className="app-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Navn</th><th>Kontakt</th><th>Type</th><th>By</th><th>Bookinger</th><th>Oprettet</th></tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <b>{c.navn}</b>
                    {c.virksomhed && <div className="app-meta">{c.virksomhed}</div>}
                  </td>
                  <td>
                    <a href={`mailto:${c.email}`} className="admin-link">{c.email}</a>
                    {c.tlf && <div className="app-meta">{c.tlf}</div>}
                  </td>
                  <td>{c.audience === "privat" ? "Privat" : "Erhverv"}</td>
                  <td>{c.by ?? "—"}</td>
                  <td>{c.bookings}</td>
                  <td>{c.createdAt ? formatDanishDate(new Date(c.createdAt)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
