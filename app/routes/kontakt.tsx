import { useFetcher } from "react-router";
import { safeParse, flatten } from "valibot";
import type { Route } from "./+types/kontakt";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { buildMeta } from "~/lib/seo";
import { ContactSchema } from "~/lib/contact-schema";

const SITE_URL = "https://define-cleaning.dk";
const PAGE_URL = `${SITE_URL}/kontakt`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Kontakt — Define Cleaning Services ApS",
      description:
        "Få et gratis, uforpligtende tilbud inden for 24 timer. Skriv eller ring — vi vender tilbage hurtigst muligt.",
      url: PAGE_URL,
      siteName: "Define Cleaning Services ApS",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const raw = {
    navn: String(form.get("navn") ?? "").trim(),
    virksomhed: String(form.get("virksomhed") ?? "").trim() || undefined,
    email: String(form.get("email") ?? "").trim(),
    tlf: String(form.get("tlf") ?? "").trim(),
    type: String(form.get("type") ?? "").trim() || undefined,
    besked: String(form.get("besked") ?? "").trim() || undefined,
  };

  const result = safeParse(ContactSchema, raw);

  if (!result.success) {
    return {
      success: false as const,
      errors: flatten<typeof ContactSchema>(result.issues).nested,
    };
  }

  const data = result.output;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    undefined;

  try {
    const [{ getDb }, { sendContactMail }, { contactSubmissions }] = await Promise.all([
      import("~/lib/db.server"),
      import("~/lib/mail.server"),
      import("~/db/schema"),
    ]);

    await getDb()!.insert(contactSubmissions).values({ ...data, ip });
    await sendContactMail(data);
  } catch (err) {
    console.error("[kontakt] submission failed:", err);
    return {
      success: false as const,
      serverError: true,
      errors: {} as Record<string, [string, ...string[]]>,
    };
  }

  return { success: true as const };
}

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt – Define Cleaning Services ApS",
  description: "Kontakt os for et gratis tilbud på erhvervsrengøring.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Kontakt", item: PAGE_URL },
    ],
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SERVICE_OPTIONS = [
  "Kontorrengøring",
  "Erhvervs- / butiksrengøring",
  "Klinik & hygiejnerengøring",
  "Vinduespolering",
  "Trappevask & ejendomsservice",
  "Flytte- / byggerengøring",
  "Industri & lager",
  "Andet",
];

type FieldErrors = Record<string, [string, ...string[]] | undefined>;

function fieldErr(errors: FieldErrors, key: string): string | undefined {
  return errors[key]?.[0];
}

function ContactForm() {
  const fetcher = useFetcher<typeof action>();
  const sent = fetcher.data?.success === true;
  const serverError = fetcher.data && "serverError" in fetcher.data && fetcher.data.serverError;
  const errors: FieldErrors = (fetcher.data && !fetcher.data.success ? fetcher.data.errors : {}) ?? {};
  const submitting = fetcher.state !== "idle";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const raw = {
      navn: (form.elements.namedItem("navn") as HTMLInputElement).value,
      virksomhed: (form.elements.namedItem("virksomhed") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      tlf: (form.elements.namedItem("tlf") as HTMLInputElement).value,
    };

    const result = safeParse(ContactSchema, raw);
    if (!result.success) {
      e.preventDefault();
      const nested = flatten<typeof ContactSchema>(result.issues).nested ?? {};
      const firstKey = (["navn", "email", "tlf"] as const).find((k) => nested[k]);
      if (firstKey) (form.elements.namedItem(firstKey) as HTMLInputElement)?.focus();
    }
  };

  return (
    <div className="formcard reveal">
      {!sent && (
        <fetcher.Form method="post" onSubmit={handleSubmit} noValidate>
          <h2>Få et gratis tilbud</h2>
          <p className="sub">Udfyld formularen, så kontakter vi dig hurtigst muligt.</p>
          {serverError && (
            <p className="sub" style={{ color: "var(--clr-accent, #e00)" }}>
              Der opstod en fejl — prøv igen eller ring til os direkte.
            </p>
          )}
          <div className="fgrid">
            <div className={`field${fieldErr(errors, "navn") ? " invalid" : ""}`}>
              <label htmlFor="navn">Navn <span className="req">*</span></label>
              <input
                type="text"
                id="navn"
                name="navn"
                autoComplete="name"
                placeholder="Dit fulde navn"
                className={fieldErr(errors, "navn") ? "err" : ""}
              />
              <span className="msg">{fieldErr(errors, "navn") ?? "Skriv venligst dit navn."}</span>
            </div>
            <div className="field">
              <label htmlFor="virksomhed">Virksomhed</label>
              <input
                type="text"
                id="virksomhed"
                name="virksomhed"
                autoComplete="organization"
                placeholder="Firmanavn"
              />
              <span className="msg">&nbsp;</span>
            </div>
            <div className={`field${fieldErr(errors, "email") ? " invalid" : ""}`}>
              <label htmlFor="email">E-mail <span className="req">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="dig@firma.dk"
                className={fieldErr(errors, "email") ? "err" : ""}
              />
              <span className="msg">{fieldErr(errors, "email") ?? "Skriv venligst en gyldig e-mail."}</span>
            </div>
            <div className={`field${fieldErr(errors, "tlf") ? " invalid" : ""}`}>
              <label htmlFor="tlf">Telefon <span className="req">*</span></label>
              <input
                type="tel"
                id="tlf"
                name="tlf"
                autoComplete="tel"
                placeholder="+45 .."
                className={fieldErr(errors, "tlf") ? "err" : ""}
              />
              <span className="msg">{fieldErr(errors, "tlf") ?? "Skriv venligst et telefonnummer."}</span>
            </div>
            <div className="field full">
              <label htmlFor="type">Hvad drejer det sig om?</label>
              <select id="type" name="type">
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="msg">&nbsp;</span>
            </div>
            <div className="field full">
              <label htmlFor="besked">Besked</label>
              <textarea
                id="besked"
                name="besked"
                placeholder="Fortæl os kort om jeres lokaler, areal og ønsker .."
              />
              <span className="msg">&nbsp;</span>
            </div>
          </div>
          <div className="form-foot">
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? "Sender …" : <><span>Send forespørgsel</span> <Arrow /></>}
            </button>
            <span className="note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Vi svarer inden for 24 timer
            </span>
          </div>
        </fetcher.Form>
      )}
      {sent && (
        <div className="success show">
          <div className="ok">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3>Tak for din henvendelse!</h3>
          <p>Vi har modtaget din forespørgsel og vender tilbage inden for 24 timer.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 22 }}>
            <a href="/" className="btn btn-primary">Tilbage til forsiden</a>
            <a href="/tjenester" className="btn btn-ghost">Se vores ydelser</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Kontakt(_: Route.ComponentProps) {
  useSiteEffects();

  return (
    <div className="page">
      <Header />
      <JsonLd data={pageSchema} />

      <main>
        <header className="phero">
          <div className="wrap">
            <nav className="crumb reveal" aria-label="Brødkrumme">
              <Link to="/">Forside</Link>
              <span className="sep">/</span>
              <b>Kontakt</b>
            </nav>
            <p className="eyebrow reveal">Kontakt</p>
            <h1 className="reveal d1">Lad os tage en snak</h1>
            <p className="lead reveal d2">
              Skriv eller ring — vi vender tilbage med et gratis, uforpligtende tilbud inden for
              24 timer. Ingen binding, bare et renere kontor.
            </p>
          </div>
        </header>

        <section className="wrap" style={{ paddingBottom: "var(--pad-section)" }}>
          <div className="kgrid">
            <ContactForm />

            <aside>
              <div className="infocard reveal d1">
                <div className="iitem">
                  <span className="ii">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <div>
                    <div className="il">Ring til os</div>
                    <div className="iv"><a href="tel:+4570123456">+45 70 12 34 56</a></div>
                  </div>
                </div>
                <div className="iitem">
                  <span className="ii">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </span>
                  <div>
                    <div className="il">Skriv til os</div>
                    <div className="iv"><a href="mailto:info@define-cleaning.dk">info@define-cleaning.dk</a></div>
                  </div>
                </div>
                <div className="iitem">
                  <span className="ii">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>
                  <div>
                    <div className="il">Åbningstider</div>
                    <div className="iv">Man–fre 7–18 · Lør 8–14</div>
                  </div>
                </div>
                <div className="iitem">
                  <span className="ii">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <div className="il">Hovedkontor</div>
                    <div className="iv">Erhvervsvej 12, 2600 Glostrup</div>
                  </div>
                </div>
              </div>

              <div className="promise reveal d2" style={{ marginTop: 18 }}>
                <div className="pi">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
                  </svg>
                </div>
                <h3>Svar inden for 24 timer</h3>
                <p>
                  Vi ved, en travl hverdag ikke kan vente. Derfor får du altid et hurtigt svar —
                  og et tilbud, du kan forstå.
                </p>
              </div>

              <div className="map-side reveal d3">
                <p className="eyebrow">Vi dækker hele Danmark</p>
                <div className="cities" style={{ marginTop: 14 }}>
                  {["København", "Aarhus", "Odense", "Aalborg", "+ 90 byer"].map((c) => (
                    <span className="city-chip" key={c}><i />{c}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
