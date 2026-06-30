import type { Recurrence } from "~/lib/bookings";

// How far ahead we keep recurring visits materialized in the DB. Each page view
// "tops up" missing occurrences up to this horizon — a cron-free scheduler.
export const SERIES_HORIZON_DAYS = 84; // 12 weeks
// Defensive cap on how many occurrences a single top-up can create.
export const MAX_GENERATE_PER_RUN = 60;

export function isRecurring(recurrence: string): boolean {
  return recurrence === "weekly" || recurrence === "biweekly" || recurrence === "monthly";
}

/** Add one recurrence interval to a `YYYY-MM-DD` date, returning `YYYY-MM-DD`. */
export function addRecurrence(dateStr: string, recurrence: Recurrence): string {
  const d = new Date(dateStr + "T00:00:00Z");
  if (recurrence === "weekly") d.setUTCDate(d.getUTCDate() + 7);
  else if (recurrence === "biweekly") d.setUTCDate(d.getUTCDate() + 14);
  else if (recurrence === "monthly") d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function horizonISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + SERIES_HORIZON_DAYS);
  return d.toISOString().slice(0, 10);
}
