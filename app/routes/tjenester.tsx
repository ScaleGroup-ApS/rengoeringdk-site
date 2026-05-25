import type { Route } from "./+types/tjenester";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/tjenester`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Tjenester | Define waters A/S",
      description:
        "Udforsk Define waters A/S's komplette sortiment af rengøringstjenester: hjemmerengøring, erhvervsrengøring, vinduespolering, til-/fraflytningsrengøring og industrirengøring.",
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
  name: "Tjenester – Define waters A/S",
  description: "Professionelle rengøringstjenester til private og erhverv.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tjenester", item: PAGE_URL },
    ],
  },
};

const SERVICES = [
  {
    id: "hjem",
    title: "Hjemmerengøring",
    tagline: "Dit hjem i topform",
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
    desc: "Vi tager os af dit hjem, så du kan fokusere på det, der virkelig betyder noget. Vores erfarne rengøringsspecialister sørger for et grundigt og omhyggeligt rent hjem, tilpasset præcis dine ønsker og behov.",
    features: [
      "Regelmæssig ugentlig eller 14-dages rengøring",
      "Grundrengøring af alle rum",
      "Støvsugning og mopping af gulve",
      "Rengøring af badeværelse og køkken",
      "Aftørring af overflader og inventar",
      "Vinduspolering indendørs",
    ],
    color: "from-sky-50 to-blue-50",
    accent: "bg-sky-50 text-primary",
  },
  {
    id: "erhverv",
    title: "Erhvervsrengøring",
    tagline: "Professionelle rammer",
    icon: "M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4l8-4M12 11l-8-4",
    desc: "Et rent arbejdsmiljø øger produktiviteten og skaber et godt førstehåndsindtryk over for kunder og samarbejdspartnere. Vi leverer fleksible erhvervsrengøringsaftaler til kontorer, butikker, lager og meget mere.",
    features: [
      "Daglig, ugentlig eller skræddersyet frekvens",
      "Rengøring uden for arbejdstid",
      "Toiletter, kantiner og fællesarealer",
      "Vinduspolering indendørs og udendørs",
      "Specialrengøring ved behov",
      "Fast kontaktperson og fleksibel aftale",
    ],
    color: "from-indigo-50 to-sky-50",
    accent: "bg-indigo-50 text-indigo-700",
  },
  {
    id: "vinduer",
    title: "Vinduespolering",
    tagline: "Klare udsigter",
    icon: "M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10",
    desc: "Snavsede vinduer kan ødelægge indtrykket af selv det pæneste hjem eller kontor. Vores vinduespoleringsteam leverer streg- og pletfri ruder — indvendigt og udvendigt på alle bygningstyper.",
    features: [
      "Polering af alle vinduestyper og størrelser",
      "Indvendigt og udvendigt",
      "Rengøring af rammer og karme",
      "Glasfacader og butiksvinduer",
      "Takrude og svær tilgængelighed",
      "Regelmæssige aftaler eller engangsservice",
    ],
    color: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-50 text-cyan-700",
  },
  {
    id: "flytning",
    title: "Til- og fraflytningsrengøring",
    tagline: "Depositummet sikret",
    icon: "M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7",
    desc: "Sørg for at stå stærkt ved boligaflevering med vores professionelle fraflytningsrengøring. Vi gennemgår alle hjørner og overflader, så du maksimerer chancen for at få dit fulde depositum tilbage.",
    features: [
      "Komplet dybderengøring af hele boligen",
      "Rengøring af hvidevarer indvendigt",
      "Vinduer, rammer og karme",
      "Gulvbehandling og fugning",
      "Skabe og skuffer",
      "Badeværelse og toilet til perfektion",
    ],
    color: "from-teal-50 to-emerald-50",
    accent: "bg-teal-50 text-teal-700",
  },
  {
    id: "industri",
    title: "Industrirengøring",
    tagline: "Tung rengøring — let gjort",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    desc: "Industrielle miljøer stiller særlige krav til rengøring. Vores specialuddannede team håndterer selv de mest krævende rengøringsopgaver i produktions- og lagerfaciliteter med professionelt udstyr.",
    features: [
      "Produktionshaller og lagerlokaler",
      "Maskinrengøring og vedligeholdelse",
      "Gulvrengøring og -behandling",
      "Affedtning og sanering",
      "Højtryksrensning",
      "Overholdelse af hygiejne- og sikkerhedskrav",
    ],
    color: "from-slate-50 to-sky-50",
    accent: "bg-slate-100 text-slate-700",
  },
];

export default function Tjenester(_: Route.ComponentProps) {
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
              <span className="text-text font-medium">Tjenester</span>
            </nav>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Vores tjenester</p>
              <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6 leading-tight tracking-tight">
                Alt inden for professionel rengøring
              </h1>
              <p className="text-xl text-text-muted leading-relaxed">
                Fra ugentlig hjemmerengøring til industriel specialrengøring — vi har løsningen, uanset hvad dit behov er.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6 space-y-16">
            {SERVICES.map((service, i) => (
              <article
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`w-14 h-14 rounded-xl ${service.accent} flex items-center justify-center mb-5`}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={service.icon}/>
                    </svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted mb-2">{service.tagline}</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 tracking-tight">{service.title}</h2>
                  <p className="text-text-muted leading-relaxed mb-6">{service.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-sky-50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span className="text-text-muted text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/kontakt"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    Få et tilbud
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
                <div className={`rounded-3xl bg-gradient-to-br ${service.color} p-12 flex items-center justify-center min-h-64 border border-sky-100 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={service.icon}/>
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-secondary">{service.title}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary" style={{ contain: "layout style paint" }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
              Ikke sikker på, hvad du har brug for?
            </h2>
            <p className="text-blue-100/80 text-lg mb-10">
              Kontakt os for en gratis rådgivning, og vi finder den rette løsning til dig.
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-sky-50 transition-all hover:shadow-xl"
            >
              Kontakt os gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
