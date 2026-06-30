import { asc, eq } from "drizzle-orm";
import { getDb } from "~/lib/db.server";
import {
  appPricingAddons,
  appPricingFrequencies,
  appPricingPropertyTypes,
  appPricingSettings,
} from "~/db/schema";
import type {
  Addon,
  AudiencePricing,
  Frequency,
  PricingConfig,
  PropertyType,
} from "~/lib/pricing";

// mysql2 returns DECIMAL columns as strings — coerce everywhere they're read.
const num = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// Pricing changes rarely and /priser is hot — cache the assembled config for a
// short TTL to avoid a DB round-trip per render.
let cache: { value: PricingConfig; at: number } | null = null;
const TTL_MS = 60_000;

export function invalidatePricingCache() {
  cache = null;
}

export async function getPricingConfig(): Promise<PricingConfig> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;

  const db = getDb();
  const [settings, ptypes, freqs, addons] = await Promise.all([
    db.select().from(appPricingSettings),
    db
      .select()
      .from(appPricingPropertyTypes)
      .where(eq(appPricingPropertyTypes.active, 1))
      .orderBy(asc(appPricingPropertyTypes.sortOrder)),
    db
      .select()
      .from(appPricingFrequencies)
      .where(eq(appPricingFrequencies.active, 1))
      .orderBy(asc(appPricingFrequencies.sortOrder)),
    db
      .select()
      .from(appPricingAddons)
      .where(eq(appPricingAddons.active, 1))
      .orderBy(asc(appPricingAddons.sortOrder)),
  ]);

  const build = (audience: "privat" | "erhverv"): AudiencePricing => {
    const s = settings.find((r) => r.audience === audience);
    const propertyTypes: PropertyType[] = ptypes
      .filter((r) => r.audience === audience)
      .map((r) => ({ id: r.id, name: r.name, rate: num(r.rate), iconKey: r.iconKey }));
    const audienceAddons: Addon[] = addons
      .filter((r) => r.audience === audience)
      .map((r) => ({
        id: r.id,
        name: r.name,
        add: r.addAmount ?? 0,
        pct: r.pct === null ? null : num(r.pct),
        iconKey: r.iconKey,
      }));
    return {
      audience,
      basePrice: s ? s.basePrice : 199,
      vatMultiplier: s ? num(s.vatMultiplier, audience === "privat" ? 1.25 : 1) : audience === "privat" ? 1.25 : 1,
      propertyTypes,
      addons: audienceAddons,
    };
  };

  const frequencies: Frequency[] = freqs.map((r) => ({
    id: r.id,
    name: r.name,
    multiplier: num(r.multiplier, 1),
    visitsPerMonth: num(r.visitsPerMonth),
  }));

  const value: PricingConfig = {
    privat: build("privat"),
    erhverv: build("erhverv"),
    frequencies,
  };

  cache = { value, at: Date.now() };
  return value;
}
