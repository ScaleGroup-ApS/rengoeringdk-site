import { and, eq, ne, sql } from "drizzle-orm";
import { getDb } from "~/lib/db.server";
import { appBookings } from "~/db/schema";
import type { Recurrence } from "~/lib/bookings";
import {
  addRecurrence,
  horizonISO,
  isRecurring,
  MAX_GENERATE_PER_RUN,
} from "~/lib/recurrence";

type ParentRow = typeof appBookings.$inferSelect;

/**
 * Ensure a recurring series has occurrences materialized up to the horizon.
 * Idempotent: generates from the latest existing occurrence date forward and
 * stops once it reaches the horizon, so re-running is a no-op. Cancelled
 * occurrences keep their date slot, so they are never silently replaced.
 */
async function topUpSeries(parent: ParentRow): Promise<number> {
  if (!isRecurring(parent.recurrence)) return 0;
  if (parent.seriesId !== parent.id) return 0; // only the parent drives generation
  const baseDate = parent.confirmedDate ?? parent.requestedDate;
  if (!baseDate) return 0;

  const db = getDb();
  // All occurrence dates already in this series (any status).
  const rows = await db
    .select({ d: appBookings.confirmedDate })
    .from(appBookings)
    .where(eq(appBookings.seriesId, parent.id));

  let last = baseDate;
  for (const r of rows) {
    if (r.d && r.d > last) last = r.d;
  }

  const horizon = horizonISO();
  const recurrence = parent.recurrence as Recurrence;
  let created = 0;
  while (created < MAX_GENERATE_PER_RUN) {
    const next = addRecurrence(last, recurrence);
    if (next > horizon) break;
    // Insert the next occurrence. The unique (series_id, confirmed_date) index
    // makes this safe against concurrent top-ups — ignore duplicates.
    await db
      .insert(appBookings)
      .values({
        userId: parent.userId,
        status: "confirmed",
        service: parent.service,
        audience: parent.audience,
        requestedDate: next,
        confirmedDate: next,
        confirmedTime: parent.confirmedTime,
        recurrence: parent.recurrence,
        seriesId: parent.id,
        address: parent.address,
        postnr: parent.postnr,
        by: parent.by,
        m2: parent.m2,
        estimatedPrice: parent.estimatedPrice,
      })
      .onDuplicateKeyUpdate({ set: { seriesId: parent.id } });
    last = next;
    created++;
  }
  return created;
}

/**
 * Promote a booking to a recurring series parent (series_id = its own id) and
 * generate its upcoming occurrences. Call when an admin confirms/reschedules a
 * recurring booking.
 */
export async function startOrTopUpSeries(bookingId: number): Promise<void> {
  const db = getDb();
  const rows = await db.select().from(appBookings).where(eq(appBookings.id, bookingId)).limit(1);
  const booking = rows[0];
  if (!booking || !isRecurring(booking.recurrence)) return;

  if (booking.seriesId == null) {
    await db.update(appBookings).set({ seriesId: booking.id }).where(eq(appBookings.id, booking.id));
    booking.seriesId = booking.id;
  }
  // Only the parent generates; if this is a child occurrence, top up its parent.
  if (booking.seriesId === booking.id) {
    await topUpSeries(booking);
  }
}

/**
 * Lazy scheduler: top up every active recurring series (optionally scoped to a
 * single user). Called from booking list/dashboard loaders — cheap when there's
 * nothing to generate.
 */
export async function topUpActiveSeries(userId?: number): Promise<void> {
  const db = getDb();
  const conditions = [
    eq(appBookings.seriesId, appBookings.id), // parents only
    ne(appBookings.status, "cancelled"),
    sql`${appBookings.recurrence} <> 'once'`,
  ];
  if (userId != null) conditions.push(eq(appBookings.userId, userId));

  const parents = await db
    .select()
    .from(appBookings)
    .where(and(...conditions));

  for (const parent of parents) {
    await topUpSeries(parent);
  }
}

/** Cancel all future (today or later) occurrences of a series. */
export async function cancelSeries(seriesId: number, userId?: number): Promise<void> {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const conditions = [
    eq(appBookings.seriesId, seriesId),
    sql`${appBookings.confirmedDate} >= ${today}`,
    ne(appBookings.status, "completed"),
  ];
  if (userId != null) conditions.push(eq(appBookings.userId, userId));
  await db.update(appBookings).set({ status: "cancelled" }).where(and(...conditions));
}
