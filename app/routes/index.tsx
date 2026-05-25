import type { Route } from "./+types/index";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Define waters A/S | Professionel Rengøring",
      description:
        "Define waters A/S leverer professionel rengøring til private og erhverv. Erfarne rengøringsfolk, fleksible aftaler og garanteret kvalitet. Kontakt os for et uforpligtende tilbud.",
      url: SITE_URL,
      siteName: "Define waters A/S",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: SITE_URL },
  ];
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Define waters A/S – Professionel Rengøring",
  description:
    "Professionel rengøring til private og erhverv i Danmark. Skræddersyede løsninger og garanteret kvalitet.",
  url: SITE_URL,
};

const SERVICES = [
  {
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
    title: "Hjemmerengøring",
    desc: "Regelmæssig og grundig rengøring af din bolig, tilpasset dine behov og ønsker.",
  },
  {
    icon: "M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4l8-4M12 11l-8-4",
    title: "Erhvervsrengøring",
    desc: "Skab et rent og professionelt arbejdsmiljø. Vi rengør kontor, butik eller lager.",
  },
  {
    icon: "M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10",
    title: "Vinduespolering",
    desc: "Skinnende rene ruder uden striber. Udendørs og indendørs polering af alle vinduestyper.",
  },
  {
    icon: "M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7",
    title: "Til- og fraflytning",
    desc: "Dybderengøring ved ind- eller udflytning, så du er sikret fuld depositum tilbage.",
  },
];

const STATS = [
  { value: "10+", label: "Års erfaring" },
  { value: "500+", label: "Tilfredse kunder" },
  { value: "98%", label: "Tilfredshedsrate" },
  { value: "100%", label: "Miljøvenlige midler" },
];

const TRUST_POINTS = [
  {
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
    title: "Forsikret & certificeret",
    desc: "Vi er fuldt forsikrede og arbejder efter branchens bedste standarder.",
  },
  {
    path: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
    title: "Fleksible tider",
    desc: "Vi tilpasser os din hverdag — dag, aften eller weekend efter aftale.",
  },
  {
    path: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    title: "Miljøvenlige produkter",
    desc: "Vi benytter udelukkende godkendte, miljøvenlige rengøringsmidler.",
  },
  {
    path: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    title: "Garanteret kvalitet",
    desc: "Ikke tilfreds? Vi kommer tilbage og gør det rigtigt — helt gratis.",
  },
];

export default function Index(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <JsonLd data={websiteSchema} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-secondary" style={{ contain: "layout style paint" }}>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 40%)",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-40">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-6">
                Define waters A/S
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                Rent og{" "}
                <span className="text-primary-light">strålende</span>{" "}
                — hver gang
              </h1>
              <p className="text-lg md:text-xl text-text-on-dark/70 mb-10 leading-relaxed max-w-2xl">
                Professionel rengøring til private og erhverv. Vi leverer skræddersyede løsninger med erfarne fagfolk og miljøvenlige produkter.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                >
                  Få et gratis tilbud
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link
                  to="/tjenester"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  Se vores tjenester
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary" aria-label="Nøgletal">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
                  <p className="text-sm text-blue-100/80">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 bg-surface-dim" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Vores tjenester</p>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-5 tracking-tight">
                Hvad kan vi hjælpe med?
              </h2>
              <p className="text-text-muted text-lg leading-relaxed">
                Vi tilbyder et bredt udvalg af professionelle rengøringsydelser — alt fra ugentlig hjemmerengøring til specialrengøring.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((service) => (
                <Link
                  key={service.title}
                  to="/tjenester"
                  className="group bg-white rounded-2xl p-7 shadow-sm border border-sky-50 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-sky-50 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={service.icon}/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">{service.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{service.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Læs mere
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/tjenester"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Se alle tjenester
              </Link>
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-24" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Hvorfor vælge os</p>
                <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 tracking-tight">
                  Rengøring du kan stole på
                </h2>
                <p className="text-text-muted text-lg leading-relaxed mb-10">
                  Hos Define waters A/S kombinerer vi faglig ekspertise med en personlig tilgang. Vi er ikke tilfredse, før du er det.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {TRUST_POINTS.map((point) => (
                    <div key={point.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-primary flex items-center justify-center flex-shrink-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={point.path}/></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary mb-1">{point.title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 aspect-square flex items-center justify-center">
                  <div className="text-center p-12">
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    </div>
                    <p className="text-6xl font-bold text-primary mb-2">98%</p>
                    <p className="text-xl font-semibold text-secondary mb-2">Kundetilfredshed</p>
                    <p className="text-text-muted">Baseret på kundeevalueringer</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-5 shadow-lg border border-sky-50">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-text-muted">Tilfredse kunder</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary" style={{ contain: "layout style paint" }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Klar til et renere hjem eller kontor?
            </h2>
            <p className="text-blue-100/80 text-lg mb-10 max-w-xl mx-auto">
              Kontakt os i dag og få et gratis, uforpligtende tilbud inden for 24 timer.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-sky-50 transition-all hover:shadow-xl"
              >
                Kontakt os nu
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a
                href="mailto:info@define-waters.dk"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-dark text-white font-semibold rounded-full hover:bg-secondary transition-all border border-blue-400/30"
              >
                info@define-waters.dk
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
