import type { ReactNode } from "react";

// SVG vectors live in code (admins edit pricing numbers, not icons). The DB
// stores only an `icon_key`; this map turns it into inner <svg> content.
// Rendered inside: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ...>
export const PRICING_ICONS: Record<string, ReactNode> = {
  // property types — privat
  lejlighed: <path d="M3 21h18M6 21V7l12-4v18" />,
  hus: (
    <>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  sommerhus: <path d="M2 22h20M3 22V10l9-7 9 7v12" />,
  flytterengoering: <path d="M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2z" />,

  // property types — erhverv
  kontor: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />,
  butik: <path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" />,
  klinik: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v6M9 11h6" />
    </>
  ),
  lager: <path d="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  ejendom: <path d="M3 9h18M9 21V9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />,

  // add-ons
  vinduespolering: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" />,
  hvidevarer: (
    <>
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  toejvask: <path d="M3 6h18M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6M9 10h6" />,
  terrasse: <path d="M12 2L2 12h3v8h14v-8h3z" />,
  gulvbehandling: <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />,
  koekken: <path d="M3 2v7c0 1 1 2 2 2s2-1 2-2V2M5 11v11M15 2c-1.5 0-3 2-3 5s1.5 4 3 4v11" />,
  dokumentation: (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M9 14l2 2 4-4" />
    </>
  ),
};

const FALLBACK_ICON = <path d="M3 12h18M12 3v18" />;

export function pricingIcon(key: string | null | undefined): ReactNode {
  if (key && PRICING_ICONS[key]) return PRICING_ICONS[key];
  return FALLBACK_ICON;
}
