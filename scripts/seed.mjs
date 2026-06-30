// One-shot, idempotent seed for define-app.
//   - pricing config (copied verbatim from the original priser.tsx constants)
//   - the initial admin user (from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
//
// Safe to re-run: rows with unique keys use INSERT ... ON DUPLICATE KEY UPDATE,
// and tables without a natural key are only seeded when empty.
//
// Run locally:  node scripts/seed.mjs
// In cluster:   apply infra/seed-job.yaml once (NOT on every deploy).
import { createPool } from "mysql2/promise";
import { readFileSync } from "node:fs";
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

async function hashPassword(plain) {
  const N = 16384;
  const salt = randomBytes(16);
  const derived = await scrypt(plain, salt, 64, { N });
  return `scrypt$${N}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

const sslConfig =
  process.env.DB_SSL_CERT && process.env.DB_SSL_KEY && process.env.DB_SSL_CA
    ? {
        cert: readFileSync(process.env.DB_SSL_CERT),
        key: readFileSync(process.env.DB_SSL_KEY),
        ca: readFileSync(process.env.DB_SSL_CA),
      }
    : undefined;

const pool = createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? "rengoeringdk_wp",
  ssl: sslConfig,
});

const SETTINGS = [
  { audience: "privat", base: 199, vat: 1.25 },
  { audience: "erhverv", base: 199, vat: 1.0 },
];

const PROPERTY_TYPES = [
  { audience: "privat", name: "Lejlighed", rate: 2.4, icon: "lejlighed", sort: 0 },
  { audience: "privat", name: "Hus", rate: 2.6, icon: "hus", sort: 1 },
  { audience: "privat", name: "Sommerhus", rate: 2.9, icon: "sommerhus", sort: 2 },
  { audience: "privat", name: "Flytterengøring", rate: 3.4, icon: "flytterengoering", sort: 3 },
  { audience: "erhverv", name: "Kontor", rate: 2.2, icon: "kontor", sort: 0 },
  { audience: "erhverv", name: "Butik", rate: 2.4, icon: "butik", sort: 1 },
  { audience: "erhverv", name: "Klinik", rate: 3.2, icon: "klinik", sort: 2 },
  { audience: "erhverv", name: "Lager / industri", rate: 1.6, icon: "lager", sort: 3 },
  { audience: "erhverv", name: "Ejendom / trappe", rate: 2.0, icon: "ejendom", sort: 4 },
];

const FREQUENCIES = [
  { name: "Dagligt", mult: 0.78, vpm: 21.7, sort: 0 },
  { name: "2× om ugen", mult: 0.85, vpm: 8.66, sort: 1 },
  { name: "Ugentligt", mult: 0.9, vpm: 4.33, sort: 2 },
  { name: "Hver 14. dag", mult: 1.0, vpm: 2.17, sort: 3 },
  { name: "Månedligt", mult: 1.08, vpm: 1.0, sort: 4 },
  { name: "Engangs", mult: 1.35, vpm: 0.0, sort: 5 },
];

const ADDONS = [
  { audience: "privat", name: "Vinduespolering", add: 149, icon: "vinduespolering", sort: 0 },
  { audience: "privat", name: "Ovn & hvidevarer", add: 195, icon: "hvidevarer", sort: 1 },
  { audience: "privat", name: "Tøjvask & stryg", add: 129, icon: "toejvask", sort: 2 },
  { audience: "privat", name: "Terrasse & udeareal", add: 175, icon: "terrasse", sort: 3 },
  { audience: "erhverv", name: "Vinduespolering", add: 149, icon: "vinduespolering", sort: 0 },
  { audience: "erhverv", name: "Gulvbehandling", add: 199, icon: "gulvbehandling", sort: 1 },
  { audience: "erhverv", name: "Køkken / kantine", add: 99, icon: "koekken", sort: 2 },
  { audience: "erhverv", name: "Hygiejnedokumentation", add: 79, icon: "dokumentation", sort: 3 },
];

async function main() {
  console.log("[seed] starting…");

  // settings — keyed by audience (unique)
  for (const s of SETTINGS) {
    await pool.query(
      `INSERT INTO app_pricing_settings (audience, base_price, vat_multiplier, currency)
       VALUES (?, ?, ?, 'DKK')
       ON DUPLICATE KEY UPDATE audience = audience`,
      [s.audience, s.base, s.vat],
    );
  }

  // property types — keyed by (audience, name) (unique)
  for (const p of PROPERTY_TYPES) {
    await pool.query(
      `INSERT INTO app_pricing_property_types (audience, name, rate, icon_key, sort_order, active)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE icon_key = VALUES(icon_key), sort_order = VALUES(sort_order)`,
      [p.audience, p.name, p.rate, p.icon, p.sort],
    );
  }

  // frequencies — no natural key; only seed when empty
  const [[freqCount]] = await pool.query("SELECT COUNT(*) AS n FROM app_pricing_frequencies");
  if (Number(freqCount.n) === 0) {
    for (const f of FREQUENCIES) {
      await pool.query(
        `INSERT INTO app_pricing_frequencies (name, multiplier, visits_per_month, sort_order, active)
         VALUES (?, ?, ?, ?, 1)`,
        [f.name, f.mult, f.vpm, f.sort],
      );
    }
  }

  // addons — no natural key; only seed when empty
  const [[addonCount]] = await pool.query("SELECT COUNT(*) AS n FROM app_pricing_addons");
  if (Number(addonCount.n) === 0) {
    for (const a of ADDONS) {
      await pool.query(
        `INSERT INTO app_pricing_addons (audience, name, add_amount, pct, icon_key, sort_order, active)
         VALUES (?, ?, ?, NULL, ?, ?, 1)`,
        [a.audience, a.name, a.add, a.icon, a.sort],
      );
    }
  }

  // initial admin
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "";
  if (adminEmail && adminPassword) {
    const hash = await hashPassword(adminPassword);
    await pool.query(
      `INSERT INTO app_users (email, password_hash, role, navn, audience)
       VALUES (?, ?, 'admin', 'Administrator', 'erhverv')
       ON DUPLICATE KEY UPDATE email = email`,
      [adminEmail, hash],
    );
    console.log(`[seed] admin ensured: ${adminEmail}`);
  } else {
    console.log("[seed] SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin");
  }

  console.log("[seed] done");
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
