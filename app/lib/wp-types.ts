// ─────────────────────────────────────────────────────────────────────────────
// WP-REST API TypeScript types
// ─────────────────────────────────────────────────────────────────────────────

/** WordPress rendered content block (title, content, excerpt all follow this shape) */
export interface WpRendered {
  rendered: string;
  protected?: boolean;
}

/** Core page object from /wp/v2/pages */
export interface WpPage {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  featured_media: number;
  parent: number;
  menu_order: number;
  template: string;
  meta: Record<string, unknown>;
  /** Embedded media/terms when requested with ?_embed */
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
}

/** Core post object from /wp/v2/posts */
export interface WpPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  featured_media: number;
  categories: number[];
  tags: number[];
  meta: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
    author?: WpAuthor[];
  };
}

/** Media object from /wp/v2/media */
export interface WpMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WpRendered;
  alt_text: string;
  media_type: string;
  mime_type: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<
      string,
      {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      }
    >;
  };
}

/** Navigation menu item from /wp/v2/menu-items or /menus/v1/menus/<id> */
export interface WpMenuItem {
  id: number;
  title: WpRendered | string;
  url: string;
  slug: string;
  menu_order: number;
  parent: number;
  target: string;
  classes: string[];
  children?: WpMenuItem[];
}

/** Taxonomy term */
export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  count: number;
}

/** Author */
export interface WpAuthor {
  id: number;
  name: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

/** Site info from the index endpoint / */
export interface WpSiteInfo {
  name: string;
  description: string;
  url: string;
  home: string;
  gmt_offset: number;
  timezone_string: string;
}
