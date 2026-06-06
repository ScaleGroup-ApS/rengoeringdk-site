import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as fs from "node:fs";

let _db: ReturnType<typeof drizzle> | undefined;

export function getDb() {
  if (_db) return _db;

  const sslConfig =
    process.env.DB_SSL_CERT && process.env.DB_SSL_KEY && process.env.DB_SSL_CA
      ? {
          cert: fs.readFileSync(process.env.DB_SSL_CERT),
          key: fs.readFileSync(process.env.DB_SSL_KEY),
          ca: fs.readFileSync(process.env.DB_SSL_CA),
        }
      : undefined;

  const pool = createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? "rengoeringdk_wp",
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 5,
  });

  // @ts-expect-error — mysql2/promise Pool is compatible at runtime; type mismatch is a drizzle-orm typedef gap
  _db = drizzle({ client: pool });
  return _db;
}
