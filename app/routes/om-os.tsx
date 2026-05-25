import type { Route } from "./+types/om-os";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/om-os`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Om Os | Define waters A/S",
      description:
        "Lær Define waters A/S at kende. Vi er et erfarent rengøringsfirma med over 10 års erfaring. Vores mission er at levere ren, sund og bæredygtig rengøring til hvert eneste kunde.",
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
  name: "Om Os – Define waters A/S",
  description: "Lær Define waters A/S at kende – vores mission, værdier og team.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Om Os", item: PAGE_URL },
    ],
  },
};

const VALUES = [
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Kvalitet",
    desc: "Vi kompromitterer aldrig med kvaliteten. Hvert eneste job udføres med samme høje standard.",
  },
  {
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    title: "Pålidelighed",
    desc: "Vi møder til aftalt tid, hver gang. Dine aftaler er hellige for os.",
  },
  {
    icon: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    title: "Bæredygtighed",
    desc: "Vi bruger kun miljøgodkendte rengøringsmidler, der er skånsomme over for natur og mennesker.",
  },
  {
    icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    title: "Omsorg",
    desc: "Vi behandler din bolig eller dit kontor, som var det vores eget.",
  },
];

export default function OmOs(_: Route.ComponentProps) {
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
              <span className="text-text font-medium">Om os</span>
            </nav>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Om os</p>
              <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6 leading-tight tracking-tight">
                Vi definerer standarden for ren&shy;gøring
              </h1>
              <p className="text-xl text-text-muted leading-relaxed">
                Define waters A/S er mere end et rengøringsfirma. Vi er din partner i at skabe rene, sunde og indbydende omgivelser — dag efter dag.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 tracking-tight">
                  Vores historie
                </h2>
                <div className="space-y-4 text-text-muted leading-relaxed">
                  <p>
                    Define waters A/S blev grundlagt med en klar vision: at revolutionere rengøringsbranchen med professionel ekspertise, miljøbevidsthed og ægte omsorg for kunderne.
                  </p>
                  <p>
                    Med base på Sjælland har vi i over et årti opbygget et solidt ry for kvalitet og pålidelighed. Vores team af erfarne rengøringsspecialister betjener hundredvis af private og erhvervskunder over hele Danmark.
                  </p>
                  <p>
                    Vi tror på, at et rent miljø er fundamentet for et godt liv og en produktiv hverdag. Derfor sætter vi os ikke bare til opgave at rengøre — vi skaber rum, hvor mennesker trives.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/kontakt"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    Kontakt os
                  </Link>
                  <Link
                    to="/tjenester"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-primary/30 text-primary font-semibold rounded-full hover:bg-sky-50 transition-all"
                  >
                    Se tjenester
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-dim rounded-2xl p-8 text-center border border-sky-100">
                  <p className="text-5xl font-bold text-primary mb-2">10+</p>
                  <p className="text-text-muted font-medium">Års erfaring</p>
                </div>
                <div className="bg-primary rounded-2xl p-8 text-center mt-8">
                  <p className="text-5xl font-bold text-white mb-2">500+</p>
                  <p className="text-blue-100/80 font-medium">Tilfredse kunder</p>
                </div>
                <div className="bg-secondary rounded-2xl p-8 text-center">
                  <p className="text-5xl font-bold text-white mb-2">98%</p>
                  <p className="text-text-on-dark/70 font-medium">Tilfredshedsrate</p>
                </div>
                <div className="bg-surface-dim rounded-2xl p-8 text-center border border-sky-100 mt-8">
                  <p className="text-5xl font-bold text-primary mb-2">100%</p>
                  <p className="text-text-muted font-medium">Miljøvenlige</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-secondary" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">Vores mission</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-3xl mx-auto">
              At levere rengøring i verdensklasse — med omtanke
            </h2>
            <p className="text-text-on-dark/60 text-xl max-w-2xl mx-auto leading-relaxed">
              Vi definerer ikke bare vandets rensende kraft — vi definerer standarden for, hvad professionel rengøring kan og bør være.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-surface-dim" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Vores værdier</p>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-5 tracking-tight">
                Det vi tror på
              </h2>
              <p className="text-text-muted text-lg leading-relaxed">
                Vores værdier er ikke bare ord på en mur. De er kernen i alt, hvad vi gør.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-7 border border-sky-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-primary flex items-center justify-center mb-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={v.icon}/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">{v.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary" style={{ contain: "layout style paint" }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
              Vil du vide mere om Define waters A/S?
            </h2>
            <p className="text-blue-100/80 text-lg mb-10">
              Ring eller skriv til os — vi er klar til at hjælpe.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-sky-50 transition-all hover:shadow-xl"
              >
                Tag kontakt
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                to="/tjenester"
                className="inline-flex items-center px-8 py-4 bg-primary-dark text-white font-semibold rounded-full hover:bg-secondary transition-all border border-blue-400/30"
              >
                Se vores tjenester
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
