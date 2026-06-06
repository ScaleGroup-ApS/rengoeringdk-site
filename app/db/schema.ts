import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  navn: varchar("navn", { length: 255 }).notNull(),
  virksomhed: varchar("virksomhed", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  tlf: varchar("tlf", { length: 50 }).notNull(),
  type: varchar("type", { length: 100 }),
  besked: text("besked"),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});
