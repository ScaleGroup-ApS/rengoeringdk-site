import { useEffect } from "react";
import { Form, Link, NavLink, Outlet, useLocation } from "react-router";
import type { Route } from "./+types/layout";
import { getUser } from "~/lib/auth/guards.server";

export function meta() {
  return [
    { title: "Define Cleaning — Min side" },
    { name: "robots", content: "noindex" },
    { name: "theme-color", content: "#06262b" },
  ];
}

export function links() {
  return [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "apple-touch-icon", href: "/icons/icon.svg" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

const CUSTOMER_TABS = [
  { to: "/app", label: "Overblik", end: true, icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { to: "/app/bookinger", label: "Bookinger", icon: "M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" },
  { to: "/app/book", label: "Book", icon: "M12 5v14M5 12h14" },
  { to: "/app/profil", label: "Profil", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" },
];

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const location = useLocation();
  const inAdmin = location.pathname.startsWith("/app/admin");

  // Register the service worker (scoped to /app) on the client only. Not in
  // root.tsx — we don't want the marketing site controlled by the app SW.
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/app" }).catch(() => {});
    }
  }, []);

  return (
    <div className="appshell">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <Link to="/app" className="app-brand" aria-label="Define Cleaning — Min side">
            <img src="/logo.png" alt="Define Cleaning" width={140} height={76} />
          </Link>

          {user ? (
            <div className="app-user">
              {user.role === "admin" && (
                <Link
                  to={inAdmin ? "/app" : "/app/admin"}
                  className="app-rolelink"
                >
                  {inAdmin ? "Min side" : "Admin"}
                </Link>
              )}
              <span className="app-user-name" title={user.email}>{user.navn}</span>
              <Form method="post" action="/app/logout">
                <button type="submit" className="app-logout">Log ud</button>
              </Form>
            </div>
          ) : (
            <Link to="/app/login" className="btn btn-primary btn-sm">Log ind</Link>
          )}
        </div>
      </header>

      <main className="app-main wrap">
        <Outlet />
      </main>

      {/* App-like bottom tab bar — customers only, on small screens */}
      {user && user.role !== "admin" && (
        <nav className="app-tabbar" aria-label="Hovedmenu">
          {CUSTOMER_TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) => `app-tab${isActive ? " active" : ""}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={t.icon} />
              </svg>
              <span>{t.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
