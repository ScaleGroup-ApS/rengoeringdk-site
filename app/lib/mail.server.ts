import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { ContactData } from "~/lib/contact-schema";

let _ses: SESv2Client | undefined;
function getSes() {
  return (_ses ??= new SESv2Client({
    region: process.env.AWS_SES_REGION ?? "eu-west-1",
    credentials: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
    },
  }));
}

export async function sendContactMail(data: ContactData) {
  const to = process.env.MAIL_TO ?? "info@define-cleaning.dk";
  const from = process.env.MAIL_FROM ?? "noreply@define-cleaning.dk";

  const lines = [
    `Navn: ${data.navn}`,
    data.virksomhed ? `Virksomhed: ${data.virksomhed}` : null,
    `E-mail: ${data.email}`,
    `Telefon: ${data.tlf}`,
    data.type ? `Ydelse: ${data.type}` : null,
    data.besked ? `\nBesked:\n${data.besked}` : null,
  ].filter(Boolean);

  await getSes().send(new SendEmailCommand({
    FromEmailAddress: from,
    ReplyToAddresses: [data.email],
    Destination: { ToAddresses: [to] },
    Content: {
      Simple: {
        Subject: { Data: `Ny forespørgsel fra ${data.navn}${data.virksomhed ? ` (${data.virksomhed})` : ""}`, Charset: "UTF-8" },
        Body: { Text: { Data: lines.join("\n"), Charset: "UTF-8" } },
      },
    },
  }));
}
