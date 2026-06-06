import { Resend } from "resend";
import type { ContactData } from "~/lib/contact-schema";

let _resend: Resend | undefined;
function getResend() {
  return (_resend ??= new Resend(process.env.RESEND_API_KEY));
}

export async function sendContactMail(data: ContactData) {
  const to = process.env.MAIL_TO ?? "info@define-cleaning.dk";
  const from = process.env.MAIL_FROM ?? "kontakt@rengoering.dk";

  const lines = [
    `Navn: ${data.navn}`,
    data.virksomhed ? `Virksomhed: ${data.virksomhed}` : null,
    `E-mail: ${data.email}`,
    `Telefon: ${data.tlf}`,
    data.type ? `Ydelse: ${data.type}` : null,
    data.besked ? `\nBesked:\n${data.besked}` : null,
  ].filter(Boolean);

  const { error } = await getResend().emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `Ny forespørgsel fra ${data.navn}${data.virksomhed ? ` (${data.virksomhed})` : ""}`,
    text: lines.join("\n"),
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}
