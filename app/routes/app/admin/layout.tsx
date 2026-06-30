import { NavLink, Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { requireAdmin } from "~/lib/auth/guards.server";

export function meta() {
  return [{ title: "Admin — Define Cleaning" }, { name: "robots", content: "noindex" }];
}

// Gate the entire /app/admin subtree. Child actions re-assert requireAdmin
// (defense in depth — loader guards don't cover child actions).
export async function loader({ request }: Route.LoaderArgs) {
  const admin = await requireAdmin(request);
  return { admin };
}

const NAV = [
  { to: "/app/admin", label: "Dashboard", end: true, icon: "M3 13h8V3H3zM13 21h8v-8h-8zM13 3v6h8V3zM3 21h8v-6H3z" },
  { to: "/app/admin/kalender", label: "Kalender", icon: "M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" },
  { to: "/app/admin/bookinger", label: "Bookinger", icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" },
  { to: "/app/admin/ny", label: "Ny aftale", icon: "M12 5v14M5 12h14" },
  { to: "/app/admin/kunder", label: "Kunder", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { to: "/app/admin/priser", label: "Prisberegner", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <p className="admin-side-title">Administration</p>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `admin-navlink${isActive ? " active" : ""}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={n.icon} />
              </svg>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
