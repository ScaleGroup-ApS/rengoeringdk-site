// Best-effort notification to the central CRM when a customer requests a
// booking. Modeled on app/lib/mail.server.ts but NON-blocking: a CRM hiccup
// must never fail the customer's booking.

type BookingNotice = {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service: string;
  requestedDate: string;
  requestedTime?: string | null;
  recurrence: string;
  address?: string | null;
  estimatedPrice?: number | null;
  note?: string | null;
};

export async function notifyBookingRequest(b: BookingNotice): Promise<void> {
  const crmUrl = process.env.CRM_INTERNAL_URL;
  const crmSecret = process.env.CRM_INTERNAL_SECRET;
  const slug = process.env.CRM_CUSTOMER_SLUG;
  if (!crmUrl || !crmSecret || !slug) return; // not configured (e.g. local dev)

  const lines = [
    "Ny bookingforespørgsel via app.define-cleaning.dk.",
    "",
    `Ydelse: ${b.service}`,
    `Ønsket dato: ${b.requestedDate}${b.requestedTime ? ` kl. ${b.requestedTime}` : ""}`,
    `Frekvens: ${b.recurrence}`,
    b.address ? `Adresse: ${b.address}` : "",
    b.estimatedPrice ? `Estimeret pris: ${b.estimatedPrice} kr. pr. besøg` : "",
    b.note ? `Bemærkning: ${b.note}` : "",
  ].filter(Boolean);

  try {
    const res = await fetch(`${crmUrl}/internal/site-submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${crmSecret}`,
      },
      body: JSON.stringify({
        slug,
        name: b.name,
        email: b.email,
        phone: b.phone,
        company: b.company,
        subject: `Booking: ${b.service}`,
        message: lines.join("\n"),
        sourceUrl: "https://app.define-cleaning.dk/app/book",
      }),
    });
    if (!res.ok) console.error("[booking-notify] CRM responded", res.status);
  } catch (err) {
    console.error("[booking-notify] failed:", err);
  }
}
