// Servicefradrag = the Danish tax deduction private households get for cleaning
// labour. The exact tax value depends on the labour share and the annual cap,
// so we only show a *vejledende* (indicative) estimate — the same ~26% rule of
// thumb the public price calculator uses.

export const SERVICEFRADRAG_RATE = 0.26;
export const MOMS_RATE = 0.25;

/** Indicative tax saving from servicefradrag on a total amount (kr). */
export function estimateServicefradrag(totalKr: number): number {
  return Math.round(totalKr * SERVICEFRADRAG_RATE);
}

/** Danish kroner formatter, no decimals. */
export function formatKr(n: number): string {
  return n.toLocaleString("da-DK") + " kr.";
}

/**
 * A booking counts as "delivered" on the receipt when it's marked completed,
 * or it's a confirmed/rescheduled visit whose date is already in the past.
 */
export function isDelivered(status: string, visitDate: string, today: string): boolean {
  if (status === "completed") return true;
  if ((status === "confirmed" || status === "rescheduled") && visitDate < today) return true;
  return false;
}

export function yearOf(dateStr: string): number {
  return Number(dateStr.slice(0, 4));
}
