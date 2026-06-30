import {
  date,
  decimal,
  int,
  mysqlTable,
  text,
  timestamp,
  tinyint,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// ── Public marketing site ──────────────────────────────────────────────
// Contact-form submissions (also forwarded to the central CRM).
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

// ── define-app: accounts ───────────────────────────────────────────────
// Prefixed `app_` so our tables are obvious in the shared WordPress DB
// (rengoeringdk_wp) and never collide with wp_* tables.
//
// `role` and `audience` are plain varchars (not mysqlEnum) so new values are
// trivial to add without an ENUM-altering migration — matching the varchar
// style already used in contact_submissions.
export const appUsers = mysqlTable(
  "app_users",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull().default("customer"), // "admin" | "customer"
    // Bumping this invalidates every existing session for the user (logout
    // everywhere). Embedded in the cookie and compared on each request.
    tokenVersion: int("token_version").notNull().default(0),
    navn: varchar("navn", { length: 255 }).notNull(),
    virksomhed: varchar("virksomhed", { length: 255 }),
    cvr: varchar("cvr", { length: 8 }),
    tlf: varchar("tlf", { length: 50 }),
    adresse: varchar("adresse", { length: 500 }),
    postnr: varchar("postnr", { length: 10 }),
    by: varchar("by", { length: 120 }),
    audience: varchar("audience", { length: 10 }).notNull().default("privat"), // "privat" | "erhverv"
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (t) => [uniqueIndex("app_users_email_unique").on(t.email)],
);

// ── define-app: bookings ───────────────────────────────────────────────
// Request-based: customer proposes a date/time, admin confirms/reschedules.
// status lifecycle: requested → confirmed → completed
//                                ↘ rescheduled ↗
//                   (any) → cancelled
export const appBookings = mysqlTable(
  "app_bookings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => appUsers.id),
    status: varchar("status", { length: 20 }).notNull().default("requested"),
    service: varchar("service", { length: 120 }).notNull(),
    audience: varchar("audience", { length: 10 }).notNull(),
    requestedDate: date("requested_date", { mode: "string" }).notNull(),
    requestedTime: varchar("requested_time", { length: 5 }), // "HH:MM"
    confirmedDate: date("confirmed_date", { mode: "string" }),
    confirmedTime: varchar("confirmed_time", { length: 5 }),
    recurrence: varchar("recurrence", { length: 20 }).notNull().default("once"), // once|weekly|biweekly|monthly
    // Recurring agreements: the originating (parent) booking has series_id = its
    // own id; auto-generated occurrences point series_id at that parent. NULL for
    // one-off bookings. No DB FK (self-reference) — relationship is logical.
    seriesId: int("series_id"),
    address: varchar("address", { length: 500 }),
    postnr: varchar("postnr", { length: 10 }),
    by: varchar("by", { length: 120 }),
    m2: int("m2"),
    estimatedPrice: int("estimated_price"), // kr snapshot at request time
    // Payment tracking (admin-managed). unpaid | invoiced | paid.
    paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("unpaid"),
    paidAmount: int("paid_amount"), // kr actually paid
    paidAt: date("paid_at", { mode: "string" }),
    // true when this booking was created manually by an admin (vs a customer request)
    createdByAdmin: tinyint("created_by_admin").notNull().default(0),
    customerNote: text("customer_note"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  // Prevents duplicate occurrences in a series (same series + same visit date).
  // NULL series_id rows (one-offs) are exempt — MySQL treats NULLs as distinct.
  (t) => [uniqueIndex("app_bookings_series_date_unique").on(t.seriesId, t.confirmedDate)],
);

// ── define-app: editable prisberegner config ───────────────────────────
// One row per audience: holds BASE price + VAT multiplier.
export const appPricingSettings = mysqlTable(
  "app_pricing_settings",
  {
    id: int("id").autoincrement().primaryKey(),
    audience: varchar("audience", { length: 10 }).notNull(), // "privat" | "erhverv"
    basePrice: int("base_price").notNull(),
    vatMultiplier: decimal("vat_multiplier", { precision: 4, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("DKK"),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (t) => [uniqueIndex("app_pricing_settings_audience_unique").on(t.audience)],
);

// Property/service types with a per-m² rate.
export const appPricingPropertyTypes = mysqlTable(
  "app_pricing_property_types",
  {
    id: int("id").autoincrement().primaryKey(),
    audience: varchar("audience", { length: 10 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    rate: decimal("rate", { precision: 5, scale: 2 }).notNull(),
    iconKey: varchar("icon_key", { length: 60 }),
    sortOrder: int("sort_order").notNull().default(0),
    active: tinyint("active").notNull().default(1),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (t) => [uniqueIndex("app_pricing_ptype_unique").on(t.audience, t.name)],
);

// Frequency multipliers (audience-independent).
export const appPricingFrequencies = mysqlTable("app_pricing_frequencies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  multiplier: decimal("multiplier", { precision: 4, scale: 2 }).notNull(),
  visitsPerMonth: decimal("visits_per_month", { precision: 5, scale: 2 }),
  sortOrder: int("sort_order").notNull().default(0),
  active: tinyint("active").notNull().default(1),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Optional add-ons: a flat kr amount and/or a percentage uplift.
export const appPricingAddons = mysqlTable("app_pricing_addons", {
  id: int("id").autoincrement().primaryKey(),
  audience: varchar("audience", { length: 10 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  addAmount: int("add_amount"),
  pct: decimal("pct", { precision: 5, scale: 4 }),
  iconKey: varchar("icon_key", { length: 60 }),
  sortOrder: int("sort_order").notNull().default(0),
  active: tinyint("active").notNull().default(1),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
