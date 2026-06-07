import type { ContactData } from "~/lib/contact-schema";

export async function sendContactMail(data: ContactData) {
  const to = process.env.MAIL_TO ?? "info@define-cleaning.dk";
  const from = process.env.MAIL_FROM ?? "noreply@define-cleaning.dk";
  const crmUrl = process.env.CRM_INTERNAL_URL ?? "http://crm-backend.crm-system.svc.cluster.local";
  const crmSecret = process.env.CRM_INTERNAL_SECRET ?? "";

  const lines = [
    `Navn: ${data.navn}`,
    data.virksomhed ? `Virksomhed: ${data.virksomhed}` : null,
    `E-mail: ${data.email}`,
    `Telefon: ${data.tlf}`,
    data.type ? `Ydelse: ${data.type}` : null,
    data.besked ? `\nBesked:\n${data.besked}` : null,
  ].filter(Boolean);

  const res = await fetch(`${crmUrl}/internal/contact-mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${crmSecret}`,
    },
    body: JSON.stringify({
      from,
      to,
      replyTo: data.email,
      subject: `Ny forespørgsel fra ${data.navn}${data.virksomhed ? ` (${data.virksomhed})` : ""}`,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) throw new Error(`CRM contact-mail failed: ${res.status}`);
}
