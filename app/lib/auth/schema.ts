import * as v from "valibot";

export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email("Skriv venligst en gyldig e-mail.")),
  password: v.pipe(v.string(), v.minLength(1, "Skriv venligst din adgangskode.")),
});

export const RegisterSchema = v.object({
  navn: v.pipe(v.string(), v.trim(), v.minLength(2, "Skriv venligst dit navn.")),
  email: v.pipe(v.string(), v.email("Skriv venligst en gyldig e-mail.")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Adgangskoden skal være mindst 8 tegn."),
  ),
  tlf: v.pipe(v.string(), v.minLength(6, "Skriv venligst et telefonnummer.")),
  audience: v.optional(v.picklist(["privat", "erhverv"]), "privat"),
  virksomhed: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
});

export const ProfileSchema = v.object({
  navn: v.pipe(v.string(), v.trim(), v.minLength(2, "Skriv venligst dit navn.")),
  tlf: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
  virksomhed: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
  cvr: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
  adresse: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
  postnr: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
  by: v.optional(v.pipe(v.string(), v.transform((s) => s.trim() || undefined))),
});

export type LoginData = v.InferOutput<typeof LoginSchema>;
export type RegisterData = v.InferOutput<typeof RegisterSchema>;
export type ProfileData = v.InferOutput<typeof ProfileSchema>;
