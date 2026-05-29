import { useState } from "react";
import type { FormEvent } from "react";
import type { Route } from "./+types/kontakt";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/kontakt`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Kontakt — Rengøringsfirma ApS",
      description:
        "Få et gratis, uforpligtende tilbud inden for 24 timer. Skriv eller ring — vi vender tilbage hurtigst muligt.",
      url: PAGE_URL,
      siteName: "Rengøringsfirma ApS",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
}

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt – Rengøringsfirma ApS",
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

type Errors = Partial<Record<"navn" | "email" | "tlf", boolean>>;

function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState({
    navn: "",
    virksomhed: "",
    email: "",
    tlf: "",
    type: SERVICE_OPTIONS[0],
    besked: "",
  });

  const update = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k === "navn" || k === "email" || k === "tlf") {
      setErrors((prev) => ({ ...prev, [k]: false }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim());
    const next: Errors = {
      navn: values.navn.trim() === "",
      email: !emailOk,
      tlf: values.tlf.trim().length < 6,
    };
    setErrors(next);
    if (next.navn || next.email || next.tlf) {
      const first = (Object.keys(next) as Array<keyof Errors>).find((k) => next[k]);
      if (first) {
        const el = document.getElementById(first) as HTMLInputElement | null;
        el?.focus();
      }
      return;
    }
    setSent(true);
  };

  const resetForm = () => {
    setSent(false);
    setValues({ navn: "", virksomhed: "", email: "", tlf: "", type: SERVICE_OPTIONS[0], besked: "" });
    setErrors({});
  };

  return (
    <div className="formcard reveal">
      {!sent && (
        <form onSubmit={handleSubmit} noValidate>
          <h2>Få et gratis tilbud</h2>
          <p className="sub">Udfyld formularen, så kontakter vi dig hurtigst muligt.</p>
          <div className="fgrid">
            <div className={`field${errors.navn ? " invalid" : ""}`}>
              <label htmlFor="navn">Navn <span className="req">*</span></label>
              <input
                type="text"
                id="navn"
                name="navn"
                autoComplete="name"
                placeholder="Dit fulde navn"
                value={values.navn}
                onChange={update("navn")}
                className={errors.navn ? "err" : ""}
              />
              <span className="msg">Skriv venligst dit navn.</span>
            </div>
            <div className="field">
              <label htmlFor="virksomhed">Virksomhed</label>
              <input
                type="text"
                id="virksomhed"
                name="virksomhed"
                autoComplete="organization"
                placeholder="Firmanavn"
                value={values.virksomhed}
                onChange={update("virksomhed")}
              />
              <span className="msg">&nbsp;</span>
            </div>
            <div className={`field${errors.email ? " invalid" : ""}`}>
              <label htmlFor="email">E-mail <span className="req">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="dig@firma.dk"
                value={values.email}
                onChange={update("email")}
                className={errors.email ? "err" : ""}
              />
              <span className="msg">Skriv venligst en gyldig e-mail.</span>
            </div>
            <div className={`field${errors.tlf ? " invalid" : ""}`}>
              <label htmlFor="tlf">Telefon <span className="req">*</span></label>
              <input
                type="tel"
                id="tlf"
                name="tlf"
                autoComplete="tel"
                placeholder="+45 .."
                value={values.tlf}
                onChange={update("tlf")}
                className={errors.tlf ? "err" : ""}
              />
              <span className="msg">Skriv venligst et telefonnummer.</span>
            </div>
            <div className="field full">
              <label htmlFor="type">Hvad drejer det sig om?</label>
              <select id="type" name="type" value={values.type} onChange={update("type")}>
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
                value={values.besked}
                onChange={update("besked")}
              />
              <span className="msg">&nbsp;</span>
            </div>
          </div>
          <div className="form-foot">
            <button type="submit" className="btn btn-primary btn-lg">
              Send forespørgsel <Arrow />
            </button>
            <span className="note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Vi svarer inden for 24 timer
            </span>
          </div>
        </form>
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
          <button type="button" className="btn btn-ghost" style={{ marginTop: 22 }} onClick={resetForm}>
            Send en ny
          </button>
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
                    <div className="iv"><a href="mailto:kontakt@rengoeringsfirma.dk">kontakt@rengoeringsfirma.dk</a></div>
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
