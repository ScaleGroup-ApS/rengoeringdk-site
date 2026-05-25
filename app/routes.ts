import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("om-os", "routes/om-os.tsx"),
  route("tjenester", "routes/tjenester.tsx"),
  route("priser", "routes/priser.tsx"),
  route("kontakt", "routes/kontakt.tsx"),
  route("robots.txt", "routes/robots[.]txt.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.tsx"),
] satisfies RouteConfig;
