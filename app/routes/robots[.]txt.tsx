import type { Route } from "./+types/robots[.]txt";

const SITE_URL = "https://define-cleaning.dk";

export function loader(_: Route.LoaderArgs) {
  const robotsTxt = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join("\n");

  return new Response(robotsTxt, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
