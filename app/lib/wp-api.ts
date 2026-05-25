// ─────────────────────────────────────────────────────────────────────────────
// WP-REST API Client
// Runs server-side in React Router loaders.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  WpPage,
  WpPost,
  WpMedia,
  WpMenuItem,
  WpSiteInfo,
} from "./wp-types";

// ── Configuration ────────────────────────────────────────────────────────────

/**
 * Base URL for the WordPress REST API.
 * In K8s this points to the internal WordPress service.
 * Override via WP_API_URL env var.
 */
const WP_API_URL: string =
  process.env.WP_API_URL || "http://wordpress/wp-json";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function wpFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${WP_API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new WpApiError(res.status, `WP-REST ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export class WpApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "WpApiError";
  }
}

// ── Site Info ────────────────────────────────────────────────────────────────

export async function getSiteInfo(): Promise<WpSiteInfo> {
  return wpFetch<WpSiteInfo>("/");
}

// ── Pages ────────────────────────────────────────────────────────────────────

export async function getPages(params?: {
  per_page?: number;
  orderby?: string;
  order?: "asc" | "desc";
}): Promise<WpPage[]> {
  return wpFetch<WpPage[]>("/wp/v2/pages", {
    per_page: String(params?.per_page ?? 100),
    orderby: params?.orderby ?? "menu_order",
    order: params?.order ?? "asc",
    _embed: "true",
  });
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const pages = await wpFetch<WpPage[]>("/wp/v2/pages", {
    slug,
    _embed: "true",
  });
  return pages[0] ?? null;
}

export async function getPageById(id: number): Promise<WpPage> {
  return wpFetch<WpPage>(`/wp/v2/pages/${id}`, { _embed: "true" });
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function getPosts(params?: {
  per_page?: number;
  page?: number;
  categories?: number[];
  orderby?: string;
  order?: "asc" | "desc";
}): Promise<WpPost[]> {
  const qs: Record<string, string> = {
    per_page: String(params?.per_page ?? 10),
    page: String(params?.page ?? 1),
    orderby: params?.orderby ?? "date",
    order: params?.order ?? "desc",
    _embed: "true",
  };
  if (params?.categories?.length) {
    qs.categories = params.categories.join(",");
  }
  return wpFetch<WpPost[]>("/wp/v2/posts", qs);
}

export async function getPostBySlug(slug: string): Promise<WpPost | null> {
  const posts = await wpFetch<WpPost[]>("/wp/v2/posts", {
    slug,
    _embed: "true",
  });
  return posts[0] ?? null;
}

// ── Media ────────────────────────────────────────────────────────────────────

export async function getMedia(id: number): Promise<WpMedia> {
  return wpFetch<WpMedia>(`/wp/v2/media/${id}`);
}

// ── Menus ────────────────────────────────────────────────────────────────────

/**
 * Fetch menu items. Requires the "WP REST API Menus" plugin or
 * WordPress 6.x+ with the navigation block menu endpoints.
 * Falls back to an empty array if the endpoint doesn't exist.
 */
export async function getMenuItems(
  menuSlugOrId: string | number,
): Promise<WpMenuItem[]> {
  try {
    const items = await wpFetch<WpMenuItem[]>(
      `/wp/v2/menu-items`,
      { menus: String(menuSlugOrId), per_page: "100" },
    );
    return nestMenuItems(items);
  } catch {
    try {
      const menu = await wpFetch<{ items: WpMenuItem[] }>(
        `/menus/v1/menus/${menuSlugOrId}`,
      );
      return menu.items ?? [];
    } catch {
      return [];
    }
  }
}

/** Nest flat menu items into a tree by parent ID */
function nestMenuItems(items: WpMenuItem[]): WpMenuItem[] {
  const map = new Map<number, WpMenuItem>();
  const roots: WpMenuItem[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parent && map.has(item.parent)) {
      map.get(item.parent)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// ── Front Page ───────────────────────────────────────────────────────────────

/**
 * Get the site's configured front page.
 * Tries the WP settings endpoint first, then falls back to common slugs.
 */
export async function getFrontPage(): Promise<WpPage | null> {
  try {
    const settings = await wpFetch<{
      show_on_front: string;
      page_on_front: number;
    }>("/wp/v2/settings");

    if (settings.show_on_front === "page" && settings.page_on_front > 0) {
      return getPageById(settings.page_on_front);
    }
  } catch {
    // Settings endpoint might require authentication — fall back
  }

  for (const slug of ["forside", "home", "front-page", "frontpage"]) {
    const page = await getPageBySlug(slug);
    if (page) return page;
  }

  return null;
}
