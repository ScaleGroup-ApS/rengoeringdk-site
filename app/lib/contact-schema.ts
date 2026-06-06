import * as v from "valibot";

export const ContactSchema = v.object({
  navn: v.pipe(v.string(), v.minLength(1, "Skriv venligst dit navn.")),
  virksomhed: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
  email: v.pipe(v.string(), v.email("Skriv venligst en gyldig e-mail.")),
  tlf: v.pipe(v.string(), v.minLength(6, "Skriv venligst et telefonnummer.")),
  type: v.optional(v.string()),
  besked: v.optional(v.string()),
});

export type ContactData = v.InferOutput<typeof ContactSchema>;
