/**
 * Catch-All Route ($.tsx)
 *
 * Server-side loader resolves URL slug → WP page.
 * Full SEO: Open Graph, Twitter Cards, JSON-LD WebPage schema, canonical URL.
 */
import type { Route } from "./+types/$";
import { data } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { WpContent } from "~/components/WpContent";
import { JsonLd } from "~/components/JsonLd";
import { getPageBySlug, getSiteInfo } from "~/lib/wp-api";
import { buildMeta, buildPageJsonLd, getFeaturedImageUrl, stripHtml } from "~/lib/seo";
import type { WpPage, WpSiteInfo } from "~/lib/wp-types";

// ── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params["*"] ?? "";
  const pageSlug = slug.split("/").filter(Boolean).pop() ?? slug;
  const siteUrl = new URL(request.url).origin;

  const [page, siteInfo] = await Promise.all([
    getPageBySlug(pageSlug).catch(() => null),
    getSiteInfo().catch(() => null),
  ]);

  if (!page) {
    throw data(null, { status: 404, statusText: "Side ikke fundet" });
  }

  return { page, siteInfo, siteUrl, slug };
}

// ── Meta ─────────────────────────────────────────────────────────────────────

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Side ikke fundet" }];

  const { page, siteInfo, siteUrl, slug } = data;
  const pageTitle = stripHtml(page.title.rendered);
  const siteName = siteInfo?.name ?? "";
  const title = siteName ? `${pageTitle} | ${siteName}` : pageTitle;
  const description = page.excerpt?.rendered
    ? stripHtml(page.excerpt.rendered)
    : undefined;

  return [
    ...buildMeta({
      title,
      description,
      url: `${siteUrl}/${slug}`,
      siteName,
      siteUrl,
      type: "website",
      image: getFeaturedImageUrl(page),
      locale: "da_DK",
      modifiedTime: page.modified_gmt,
    }),
    { tagName: "link", rel: "canonical", href: `${siteUrl}/${slug}` },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CatchAll({ loaderData }: Route.ComponentProps) {
  const { page, siteInfo, siteUrl } = loaderData;
  const siteName = siteInfo?.name ?? "Site";

  return (
    <div className="flex flex-col min-h-screen">
      <Header siteName={siteName} />

      {/* JSON-LD Structured Data */}
      <JsonLd data={buildPageJsonLd({ page, siteInfo, siteUrl })} />

      <main className="flex-1">
        <article className="animate-fade-in-up">
          <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
            <h1
              className="text-4xl md:text-5xl font-bold text-secondary leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: page.title.rendered }}
            />
          </div>
          <WpContent html={page.content.rendered} />
        </article>
      </main>

      <Footer siteName={siteName} siteDescription={siteInfo?.description} />
    </div>
  );
}
