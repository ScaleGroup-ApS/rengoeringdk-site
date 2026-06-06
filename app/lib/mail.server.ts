import nodemailer from "nodemailer";
import type { ContactData } from "~/lib/contact-schema";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mailserver",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
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

  await getTransport().sendMail({
    from,
    to,
    replyTo: data.email,
    subject: `Ny forespørgsel fra ${data.navn}${data.virksomhed ? ` (${data.virksomhed})` : ""}`,
    text: lines.join("\n"),
  });
}
