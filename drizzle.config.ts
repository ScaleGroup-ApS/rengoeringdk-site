import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "rengoeringdk_wp",
    ssl: process.env.DB_SSL_CA
      ? { ca: process.env.DB_SSL_CA, cert: process.env.DB_SSL_CERT, key: process.env.DB_SSL_KEY }
      : undefined,
  },
});
