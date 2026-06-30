// Pure, isomorphic pricing logic — shared by the public prisberegner and the
// app. No server-only imports here.

export type Audience = "privat" | "erhverv";

export type PropertyType = {
  id: number;
  name: string;
  rate: number;
  iconKey: string | null;
};

export type Frequency = {
  id: number;
  name: string;
  multiplier: number;
  visitsPerMonth: number;
};

export type Addon = {
  id: number;
  name: string;
  add: number; // flat kr (0 if none)
  pct: number | null; // percentage uplift (e.g. 0.1 = +10%)
  iconKey: string | null;
};

export type AudiencePricing = {
  audience: Audience;
  basePrice: number;
  vatMultiplier: number;
  propertyTypes: PropertyType[];
  addons: Addon[];
};

export type PricingConfig = {
  privat: AudiencePricing;
  erhverv: AudiencePricing;
  frequencies: Frequency[];
};

/**
 * The per-visit price. Mirrors the original calculator formula exactly:
 *   ((base + m2*rate) * freqMult + flatAddons) * (1 + pct?) * vatMul
 */
export function calcPerVisit(input: {
  basePrice: number;
  m2: number;
  rate: number;
  freqMultiplier: number;
  addonFlat: number;
  addonPct?: number | null;
  vatMultiplier: number;
}): number {
  const { basePrice, m2, rate, freqMultiplier, addonFlat, addonPct, vatMultiplier } = input;
  let v = (basePrice + m2 * rate) * freqMultiplier + addonFlat;
  if (addonPct) v *= 1 + addonPct;
  return v * vatMultiplier;
}

/** Format a kroner amount, rounded to the nearest `round`. */
export function kr(n: number, round: number): string {
  const rounded = Math.round(n / round) * round;
  return rounded.toLocaleString("da-DK") + " kr.";
}

/** Display label for an add-on, derived from its values (kept out of the DB). */
export function addonSubLabel(a: { add: number; pct: number | null }): string {
  if (a.pct) return `+${Math.round(a.pct * 100)}%`;
  return `+${a.add} kr.`;
}

export function m2note(value: number): string {
  if (value < 80) return "≈ lille lejlighed / kontor";
  if (value < 200) return "≈ hus / mellemstort kontor";
  if (value < 500) return "≈ stort hus / etage / butik";
  if (value < 1000) return "≈ flere etager";
  return "≈ stort erhvervsareal";
}
