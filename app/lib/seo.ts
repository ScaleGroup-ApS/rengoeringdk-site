// ─────────────────────────────────────────────────────────────────────────────
// SEO Helpers
// Generates meta tags, Open Graph, JSON-LD structured data, and canonical URLs.
// ─────────────────────────────────────────────────────────────────────────────

import type { WpPage, WpPost, WpSiteInfo } from "./wp-types";

interface SeoOptions {
  title: string;
  description?: string;
  url?: string;
  siteName?: string;
  siteUrl?: string;
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

/**
 * Generate a complete set of meta tags for React Router's `meta` export.
 */
export function buildMeta(opts: SeoOptions) {
  const meta: Array<Record<string, string>> = [
    { title: opts.title },
  ];

  if (opts.description) {
    meta.push({ name: "description", content: opts.description });
  }

  // Open Graph
  meta.push({ property: "og:title", content: opts.title });
  meta.push({ property: "og:type", content: opts.type ?? "website" });
  if (opts.description) {
    meta.push({ property: "og:description", content: opts.description });
  }
  if (opts.url) {
    meta.push({ property: "og:url", content: opts.url });
  }
  if (opts.siteName) {
    meta.push({ property: "og:site_name", content: opts.siteName });
  }
  meta.push({ property: "og:locale", content: opts.locale ?? "da_DK" });

  if (opts.image) {
    meta.push({ property: "og:image", content: opts.image });
    meta.push({ property: "og:image:width", content: "1200" });
    meta.push({ property: "og:image:height", content: "630" });
    if (opts.imageAlt) {
      meta.push({ property: "og:image:alt", content: opts.imageAlt });
    }
  }

  // Twitter Card
  meta.push({ name: "twitter:card", content: opts.image ? "summary_large_image" : "summary" });
  meta.push({ name: "twitter:title", content: opts.title });
  if (opts.description) {
    meta.push({ name: "twitter:description", content: opts.description });
  }
  if (opts.image) {
    meta.push({ name: "twitter:image", content: opts.image });
  }

  // Article dates
  if (opts.type === "article") {
    if (opts.publishedTime) {
      meta.push({ property: "article:published_time", content: opts.publishedTime });
    }
    if (opts.modifiedTime) {
      meta.push({ property: "article:modified_time", content: opts.modifiedTime });
    }
  }

  // Robots
  if (opts.noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  return meta;
}

/**
 * Generate JSON-LD structured data for a page.
 */
export function buildPageJsonLd(opts: {
  page: WpPage | WpPost;
  siteInfo?: WpSiteInfo | null;
  siteUrl: string;
  type?: "WebPage" | "Article" | "BlogPosting";
}) {
  const { page, siteInfo, siteUrl, type = "WebPage" } = opts;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: stripHtml(page.title.rendered),
    headline: stripHtml(page.title.rendered),
    url: `${siteUrl}/${page.slug}`,
    datePublished: page.date_gmt,
    dateModified: page.modified_gmt,
  };

  if (page.excerpt?.rendered) {
    jsonLd.description = stripHtml(page.excerpt.rendered);
  }

  // Featured image
  const media = page._embedded?.["wp:featuredmedia"]?.[0];
  if (media) {
    jsonLd.image = {
      "@type": "ImageObject",
      url: media.source_url,
      width: media.media_details?.width,
      height: media.media_details?.height,
    };
  }

  if (siteInfo) {
    jsonLd.publisher = {
      "@type": "Organization",
      name: siteInfo.name,
      url: siteUrl,
    };
  }

  // BreadcrumbList
  jsonLd.mainEntity = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Forside",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: stripHtml(page.title.rendered),
        item: `${siteUrl}/${page.slug}`,
      },
    ],
  };

  return jsonLd;
}

/**
 * Generate WebSite JSON-LD (for the homepage).
 */
export function buildWebsiteJsonLd(siteInfo: WpSiteInfo | null, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteInfo?.name ?? "Website",
    description: siteInfo?.description ?? "",
    url: siteUrl,
  };
}

/**
 * Extract the featured image URL from a WP page/post with _embed.
 */
export function getFeaturedImageUrl(page: WpPage | WpPost): string | undefined {
  return page._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
}

/** Strip HTML tags from a string (for use in meta descriptions). */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}
