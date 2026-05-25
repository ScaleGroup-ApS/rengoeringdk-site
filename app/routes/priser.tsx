import type { Route } from "./+types/priser";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/priser`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Priser | Define waters A/S",
      description:
        "Gennemsigtige og konkurrencedygtige priser på rengøring. Se vores pakker for hjemmerengøring, erhvervsrengøring og specialopgaver. Få et gratis tilbud fra Define waters A/S.",
      url: PAGE_URL,
      siteName: "Define waters A/S",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
}

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Priser – Define waters A/S",
  description: "Konkurrencedygtige priser på professionel rengøring.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Priser", item: PAGE_URL },
    ],
  },
};

const PLANS = [
  {
    name: "Basis",
    price: "Fra 349",
    unit: "kr./besøg",
    desc: "Ideel til den travle hverdag. Fast ugentlig rengøring af din bolig.",
    features: [
      "Op til 80 m² bolig",
      "Ugentlig rengøring",
      "Støvsugning og mopping",
      "Badeværelse & køkken",
      "Aftørring af overflader",
      "Fleksibel tidsplan",
    ],
    cta: "Vælg Basis",
    highlight: false,
  },
  {
    name: "Standard",
    price: "Fra 549",
    unit: "kr./besøg",
    desc: "Vores mest populære pakke — komplet rengøring til mellemstore boliger og erhverv.",
    features: [
      "Op til 130 m²",
      "Valgfri frekvens",
      "Alt i Basis-pakken",
      "Vinduespolering indendørs",
      "Køleskab og ovn",
      "Fast rengøringsassistent",
    ],
    cta: "Vælg Standard",
    highlight: true,
  },
  {
    name: "Premium",
    price: "Fra 849",
    unit: "kr./besøg",
    desc: "Det komplette rengøringsforløb — til større boliger, erhverv og særlige krav.",
    features: [
      "Op til 220 m²",
      "Skræddersyet frekvens",
      "Alt i Standard-pakken",
      "Vinduespolering udendørs",
      "Prioritet ved booking",
      "Dedikeret kundeansvarlig",
    ],
    cta: "Vælg Premium",
    highlight: false,
  },
];

const EXTRAS = [
  { name: "Vinduespolering (udendørs)", price: "Fra 295 kr." },
  { name: "Fraflytningsrengøring", price: "Fra 1.995 kr." },
  { name: "Kælder- eller loftrengøring", price: "Fra 595 kr." },
  { name: "Terrasserengøring", price: "Fra 395 kr." },
  { name: "Ovn og hvidevarer (ekstra)", price: "Fra 195 kr." },
  { name: "Erhvervs-specialrengøring", price: "Pris på forespørgsel" },
];

const FAQS = [
  {
    q: "Hvad er inkluderet i prisen?",
    a: "Alle priser inkluderer rengøringsmidler og udstyr. Vi medbringer alt, hvad vi har brug for — du behøver blot at have adgang til boligen.",
  },
  {
    q: "Kan jeg ændre eller aflyse en aftale?",
    a: "Ja. Du kan ændre eller aflyse en aftale senest 48 timer inden det aftalte tidspunkt uden beregning. Ved kortere varsel opkræves et gebyr.",
  },
  {
    q: "Bruger I miljøvenlige produkter?",
    a: "Ja, altid. Vi benytter udelukkende godkendte, miljøvenlige rengøringsmidler, der er skånsomme over for mennesker, dyr og natur.",
  },
  {
    q: "Kan jeg få et tilpasset tilbud?",
    a: "Absolut. Kontakt os med dine specifikke behov, og vi udarbejder et gratis, skræddersyet tilbud inden for 24 timer.",
  },
];

export default function Priser(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <JsonLd data={pageSchema} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-surface-dim py-20 border-b border-sky-100" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Brødkrumme">
              <Link to="/" className="hover:text-primary transition-colors">Forside</Link>
              <span aria-hidden="true">/</span>
              <span className="text-text font-medium">Priser</span>
            </nav>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Priser</p>
              <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6 leading-tight tracking-tight">
                Gennemsigtige priser — ingen overraskelser
              </h1>
              <p className="text-xl text-text-muted leading-relaxed">
                Vi tror på ærlighed. Vores priser er klare og konkurrencedygtige, og du betaler kun for det, du har brug for.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-24" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-secondary mb-4 tracking-tight">Vores pakker</h2>
              <p className="text-text-muted text-lg">Vælg den pakke, der passer til din bolig eller virksomhed. Alle pakker kan skræddersys.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl p-8 relative flex flex-col ${
                    plan.highlight
                      ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105"
                      : "bg-white border border-sky-100 shadow-sm"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Mest populær
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-secondary"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-4 ${plan.highlight ? "text-blue-100/80" : "text-text-muted"}`}>
                      {plan.desc}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-secondary"}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${plan.highlight ? "text-blue-100/70" : "text-text-muted"}`}>
                        {plan.unit}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? "bg-white/20" : "bg-sky-50"}`}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "white" : "#0369a1"} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span className={`text-sm ${plan.highlight ? "text-blue-50" : "text-text-muted"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/kontakt"
                    className={`block w-full text-center py-3.5 rounded-2xl font-semibold transition-all ${
                      plan.highlight
                        ? "bg-white text-primary hover:bg-sky-50"
                        : "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-text-muted text-sm mt-8">
              Priser er vejledende og afhænger af boligens størrelse og tilstand.{" "}
              <Link to="/kontakt" className="text-primary hover:underline font-medium">Kontakt os</Link>{" "}
              for et præcist tilbud.
            </p>
          </div>
        </section>

        {/* Extras */}
        <section className="py-24 bg-surface-dim" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-secondary mb-4 tracking-tight">Tillægstjenester</h2>
              <p className="text-text-muted text-lg">Tilføj ekstra ydelser til din aftale efter behov.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXTRAS.map((extra) => (
                <div key={extra.name} className="bg-white rounded-2xl p-6 border border-sky-100 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-primary flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </div>
                    <span className="font-medium text-secondary">{extra.name}</span>
                  </div>
                  <span className="text-primary font-bold text-sm whitespace-nowrap">{extra.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24" style={{ contain: "layout style paint" }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-secondary mb-4 tracking-tight">Ofte stillede spørgsmål</h2>
              <p className="text-text-muted text-lg">Har du spørgsmål, der ikke er besvaret her? <Link to="/kontakt" className="text-primary hover:underline">Kontakt os</Link>.</p>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-surface-dim rounded-2xl p-6 border border-sky-50">
                  <h3 className="font-bold text-secondary mb-2">{faq.q}</h3>
                  <p className="text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary" style={{ contain: "layout style paint" }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
              Klar til at komme i gang?
            </h2>
            <p className="text-blue-100/80 text-lg mb-10">
              Få et gratis og uforpligtende tilbud inden for 24 timer.
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-sky-50 transition-all hover:shadow-xl"
            >
              Få et gratis tilbud
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
