import type { ContactData } from "~/lib/contact-schema";

/**
 * Forward a contact-form submission to the CRM.
 *
 * The CRM stores the submission centrally (so the team can view + resend it from
 * the customer's edit page) and delivers a notification email to the customer's
 * chosen recipient — a single source of truth that can be changed in the CRM
 * without redeploying this site. See POST /internal/site-submission.
 */
export async function sendContactMail(
  data: ContactData,
  meta?: { sourceUrl?: string; ip?: string }
) {
  const crmUrl = process.env.CRM_INTERNAL_URL!;
  const crmSecret = process.env.CRM_INTERNAL_SECRET!;
  // The slug is this site's k8s namespace — the CRM resolves the customer from it.
  const slug = process.env.CRM_CUSTOMER_SLUG;

  if (!slug) {
    throw new Error("CRM_CUSTOMER_SLUG is not configured for this site");
  }

  const res = await fetch(`${crmUrl}/internal/site-submission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${crmSecret}`,
    },
    body: JSON.stringify({
      slug,
      name: data.navn,
      email: data.email,
      phone: data.tlf,
      company: data.virksomhed,
      subject: data.type,
      message: data.besked,
      sourceUrl: meta?.sourceUrl,
      ip: meta?.ip,
    }),
  });

  if (!res.ok) throw new Error(`CRM site-submission failed: ${res.status}`);
}
