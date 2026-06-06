// Production migration runner — uses drizzle-orm/mysql2/migrator (no drizzle-kit needed).
// Run with: node scripts/migrate.mjs
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createPool } from "mysql2/promise";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const db = drizzle({ client: pool });

const migrationsFolder = join(__dirname, "..", "drizzle", "migrations");

console.log(`[migrate] applying migrations from ${migrationsFolder}`);
await migrate(db, { migrationsFolder });
console.log("[migrate] done");
await pool.end();
process.exit(0);
