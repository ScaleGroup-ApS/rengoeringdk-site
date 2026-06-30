// Isomorphic booking display helpers — shared by customer and admin screens.

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "rescheduled"
  | "completed"
  | "cancelled";

export type Recurrence = "once" | "weekly" | "biweekly" | "monthly";

export const STATUS_LABELS: Record<BookingStatus, string> = {
  requested: "Afventer",
  confirmed: "Bekræftet",
  rescheduled: "Ny tid foreslået",
  completed: "Udført",
  cancelled: "Aflyst",
};

export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  once: "Engangs",
  weekly: "Ugentligt",
  biweekly: "Hver 14. dag",
  monthly: "Månedligt",
};

export function statusLabel(s: string): string {
  return STATUS_LABELS[s as BookingStatus] ?? s;
}

export function recurrenceLabel(r: string): string {
  return RECURRENCE_LABELS[r as Recurrence] ?? r;
}

export function formatDanishDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value + "T00:00:00") : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

// active bookings = anything not finished
export function isActiveBooking(status: string): boolean {
  return status !== "completed" && status !== "cancelled";
}
