import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("privat", "routes/privat.tsx"),
  route("erhverv", "routes/erhverv.tsx"),
  route("om-os", "routes/om-os.tsx"),
  route("tjenester", "routes/tjenester.tsx"),
  route("tjenester/:slug", "routes/tjenester.$slug.tsx"),
  route("priser", "routes/priser.tsx"),
  route("api/cvr", "routes/api.cvr.tsx"),
  route("kontakt", "routes/kontakt.tsx"),
  route("robots.txt", "routes/robots[.]txt.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.tsx"),

  // ── define-app (app.define-cleaning.dk) ──────────────────────────────
  route("app", "routes/app/layout.tsx", [
    index("routes/app/index.tsx"),
    route("login", "routes/app/login.tsx"),
    route("logout", "routes/app/logout.tsx"),
    route("register", "routes/app/register.tsx"),
    route("profil", "routes/app/profil.tsx"),
    route("bookinger", "routes/app/bookinger.tsx"),
    route("book", "routes/app/book.tsx"),
    route("kvittering", "routes/app/kvittering.tsx"),
    route("admin", "routes/app/admin/layout.tsx", [
      index("routes/app/admin/index.tsx"),
      route("bookinger", "routes/app/admin/bookinger.tsx"),
      route("priser", "routes/app/admin/priser.tsx"),
      route("kunder", "routes/app/admin/kunder.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
