import type { Route } from "./+types/sitemap[.]xml";

const SITE_URL = "https://rengoering.dk";
const TODAY = "2026-05-25";

const PAGES = [
  { loc: SITE_URL, lastmod: TODAY, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE_URL}/om-os`, lastmod: TODAY, priority: "0.8", changefreq: "monthly" },
  { loc: `${SITE_URL}/tjenester`, lastmod: TODAY, priority: "0.9", changefreq: "monthly" },
  { loc: `${SITE_URL}/priser`, lastmod: TODAY, priority: "0.8", changefreq: "monthly" },
  { loc: `${SITE_URL}/kontakt`, lastmod: TODAY, priority: "0.7", changefreq: "monthly" },
];

export function loader(_: Route.LoaderArgs) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...PAGES.map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    ),
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
