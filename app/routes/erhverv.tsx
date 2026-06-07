import type { Route } from "./+types/erhverv";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { ImageFrame } from "~/components/ImageFrame";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { PHOTOS } from "~/lib/photos";
import { servicesFor } from "~/lib/services";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://define-cleaning.dk";
const PAGE_URL = `${SITE_URL}/erhverv`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Erhvervsrengøring — Define Cleaning Services ApS",
      description:
        "Professionel erhvervsrengøring i hele Danmark. Kontor, butik, klinik, industri, hotel og restaurant. INSTA 800-dokumenteret, fast team og fleksible aftaler.",
      url: PAGE_URL,
      siteName: "Define Cleaning Services ApS",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
}

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Erhvervsrengøring – Define Cleaning Services ApS",
  description: "Professionel erhvervsrengøring til virksomheder i hele Danmark.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Erhverv", item: PAGE_URL },
    ],
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const TRUST_POINTS = [
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    title: "Dokumenteret kvalitet efter INSTA 800",
    desc: "Vi arbejder efter den nordiske kvalitetsstandard og dokumenterer hvert besøg — så I altid kan vise kvaliteten ved tilsyn og audits.",
  },
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    title: "Fast team og navngivet kontaktperson",
    desc: "Samme team hver gang — oplært i jeres lokaler. Og én navngivet kontaktperson, I altid kan ringe direkte til.",
  },
  {
    icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
    title: "Svanemærkede produkter",
    desc: "Skånsomt for medarbejdere, miljø og indeklima — uden at gå på kompromis med det rene resultat.",
  },
];

const STEPS_ERHVERV = [
  { n: "TRIN 01", title: "Uforpligtende besigtigelse", desc: "Vi ser lokalerne, lytter til jeres behov og lærer driften at kende — uden binding." },
  { n: "TRIN 02", title: "Skræddersyet tilbud på 24 timer", desc: "Fast, gennemsigtig pris med klare leverancer og dokumentation." },
  { n: "TRIN 03", title: "Opstart med fast team", desc: "Samme medarbejdere hver gang — oplært specifikt i jeres lokaler." },
  { n: "TRIN 04", title: "Løbende kvalitetstjek", desc: "Vi dokumenterer og følger op, så standarden holder år efter år." },
];

export default function Erhverv(_: Route.ComponentProps) {
  useSiteEffects();
  const erhvervServices = servicesFor("erhverv");

  return (
    <div className="page">
      <Header />
      <JsonLd data={pageSchema} />

      <main>
        {/* hero */}
        <header className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="eyebrow reveal">Erhvervsrengøring</p>
              <h1 className="reveal d1">
                Et <span className="hl">skinnende</span> indtryk — hver eneste dag
              </h1>
              <p className="hero-lead reveal d2">
                Vi holder kontorer, klinikker, butikker og produktion rene for over 500 danske virksomheder.
                Fast team, dokumenteret kvalitet efter INSTA 800 og fleksible aftaler — i hele Danmark.
              </p>
              <div className="hero-cta reveal d3">
                <Link className="btn btn-primary" to="/priser?for=erhverv#beregner">
                  Beregn din pris <Arrow />
                </Link>
                <Link className="btn btn-ghost" to="/kontakt?audience=erhverv">
                  Få et tilbud
                </Link>
              </div>
              <div className="trust-marks reveal d4">
                <span className="tm-label">Certificeret af</span>
                <span className="trust-mark svane">
                  <span className="tm-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-2 5-6 6-6 11a6 6 0 0012 0c0-5-4-6-6-11z"/></svg>
                  </span>
                  Svanemærket
                </span>
                <span className="trust-mark servn">
                  <span className="tm-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  Servicenormen
                </span>
              </div>
            </div>
            <div className="hero-media reveal d2">
              <ImageFrame className="hero-img-frame" src={PHOTOS.heroErhverv} alt="Lyst, rent moderne kontor" />
            </div>
          </div>
        </header>

        {/* why */}
        <section className="blk wrap">
          <div className="why-grid">
            <div>
              <p className="eyebrow reveal">Hvorfor Define til erhverv</p>
              <h2 className="reveal d1" style={{ fontSize: "var(--fs-display)", marginTop: 16 }}>
                En partner I kan stole blindt på
              </h2>
              <div className="why-list">
                {TRUST_POINTS.map((p, i) => (
                  <div key={p.title} className={`why-item reveal d${i + 1}`}>
                    <span className="why-ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {p.icon}
                      </svg>
                    </span>
                    <div>
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal d2">
              <ImageFrame
                src={PHOTOS.heroErhverv}
                alt="Professionelt rengøringsteam i moderne kontor"
                style={{ width: "100%", aspectRatio: "4/4.4", borderRadius: "var(--radius-3xl)" }}
              />
            </div>
          </div>
        </section>

        {/* services */}
        <section className="blk wrap" id="ydelser" style={{ paddingTop: 0 }}>
          <div className="shead reveal">
            <p className="eyebrow">Se vores ydelser</p>
            <h2>Hvad kan vi gøre for jeres virksomhed?</h2>
            <p>Vælg en kategori for at læse mere og se vejledende priser ekskl. moms.</p>
          </div>
          <div className="svc-grid">
            {erhvervServices.map((svc, i) => (
              <Link
                key={svc.slug}
                to={`/tjenester/${svc.slug}`}
                className={`svc reveal${i % 3 ? ` d${i % 3}` : ""}`}
              >
                <div className="svc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={svc.iconPath} />
                  </svg>
                </div>
                <h3>{svc.title}</h3>
                <p>{svc.shortDesc}</p>
                <span className="more">Læs mere <Arrow /></span>
              </Link>
            ))}
          </div>
        </section>

        {/* process */}
        <section className="blk wrap">
          <div className="shead reveal">
            <p className="eyebrow">Sådan kommer I i gang</p>
            <h2 style={{ fontSize: "var(--fs-display)" }}>Fra tilbud til ren virksomhed på 4 trin</h2>
          </div>
          <div className="steps">
            {STEPS_ERHVERV.map((s, i) => (
              <div key={s.n} className={`step reveal${i ? ` d${i}` : ""}`}>
                <div className="n">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="blk wrap" style={{ paddingTop: 0 }}>
          <div className="ctaband reveal">
            <h2>Klar til et renere arbejdsmiljø?</h2>
            <p>Få et gratis, uforpligtende tilbud inden for 24 timer. Ingen binding — bare et renere kontor.</p>
            <div className="row">
              <Link className="btn btn-white btn-lg" to="/priser?for=erhverv#beregner">Beregn din pris <Arrow /></Link>
              <a className="btn btn-lg" style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }} href="tel:+4570123456">
                Ring 70 12 34 56
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
