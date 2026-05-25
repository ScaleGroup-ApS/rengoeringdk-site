/**
 * Homepage Route
 *
 * Server-side loader fetches WP front page and site info.
 * Full SEO: Open Graph, Twitter Cards, JSON-LD WebSite schema.
 */
import type { Route } from "./+types/index";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { WpContent } from "~/components/WpContent";
import { JsonLd } from "~/components/JsonLd";
import { getFrontPage, getSiteInfo } from "~/lib/wp-api";
import { buildMeta, buildWebsiteJsonLd, buildPageJsonLd, getFeaturedImageUrl, stripHtml } from "~/lib/seo";
import type { WpPage, WpSiteInfo } from "~/lib/wp-types";

// ── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ request }: Route.LoaderArgs) {
  const siteUrl = new URL(request.url).origin;

  let page: WpPage | null = null;
  let siteInfo: WpSiteInfo | null = null;
  let error: string | null = null;

  try {
    [page, siteInfo] = await Promise.all([
      getFrontPage().catch(() => null),
      getSiteInfo().catch(() => null),
    ]);
  } catch {
    error = "Kunne ikke oprette forbindelse til CMS";
  }

  return { page, siteInfo, error, siteUrl };
}

// ── Meta ─────────────────────────────────────────────────────────────────────

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Velkommen" }];

  const { siteInfo, page, siteUrl } = data;
  const siteName = siteInfo?.name ?? "Velkommen";
  const description = page?.excerpt?.rendered
    ? stripHtml(page.excerpt.rendered)
    : siteInfo?.description ?? "Velkommen til vores hjemmeside.";

  return [
    ...buildMeta({
      title: siteName,
      description,
      url: siteUrl,
      siteName,
      siteUrl,
      type: "website",
      image: page ? getFeaturedImageUrl(page) : undefined,
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: siteUrl },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Index({ loaderData }: Route.ComponentProps) {
  const { page, siteInfo, error, siteUrl } = loaderData;
  const siteName = siteInfo?.name ?? "Velkommen";

  return (
    <div className="flex flex-col min-h-screen">
      <Header siteName={siteName} />

      {/* JSON-LD Structured Data */}
      <JsonLd data={buildWebsiteJsonLd(siteInfo, siteUrl)} />
      {page && <JsonLd data={buildPageJsonLd({ page, siteInfo, siteUrl })} />}

      <main className="flex-1">
        {error ? (
          <ErrorState message={error} />
        ) : page ? (
          <article className="animate-fade-in-up">
            <WpContent html={page.content.rendered} />
          </article>
        ) : (
          <FallbackHero siteName={siteName} />
        )}
      </main>

      <Footer siteName={siteName} siteDescription={siteInfo?.description} />
    </div>
  );
}

/** Shown when no front page is configured in WordPress yet */
function FallbackHero({ siteName }: { siteName: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent)_0%,_transparent_60%)] opacity-20" />

      <div className="relative max-w-5xl mx-auto px-6 py-32 md:py-44 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6 animate-fade-in-up">
          Velkommen til
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.05] tracking-tight animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {siteName}
        </h1>
        <p
          className="text-lg md:text-xl text-text-on-dark/70 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Din hjemmeside er ved at blive sat op. Indhold vil snart være
          tilgængeligt her.
        </p>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <a
            href="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-secondary font-semibold rounded-full hover:bg-surface-dim transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            Kontakt os
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-secondary mb-3">Indhold utilgængeligt</h2>
      <p className="text-text-muted">{message}</p>
    </div>
  );
}
