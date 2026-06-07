import type { Route } from "./+types/privat";
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
const PAGE_URL = `${SITE_URL}/privat`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Hjemmerengøring til private — Define Cleaning Services ApS",
      description:
        "Professionel hjemmerengøring i hele Danmark. Faste rengøringer, hovedrengøring, flytterengøring og vinduespudsning for private hjem. Svanemærkede produkter, fast personale.",
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
  name: "Hjemmerengøring til private – Define Cleaning Services ApS",
  description: "Professionel hjemmerengøring til private hjem.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Privat", item: PAGE_URL },
    ],
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TRUST_POINTS = [
  {
    icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
    title: "Svanemærkede produkter",
    desc: "Skånsomt for både dig, dine børn og dine kæledyr — uden at gå på kompromis med det rene resultat.",
  },
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    title: "Fast personale, du kender",
    desc: "Samme rengøringsassistenter hver gang. De kender dit hjem og dine præferencer — og du møder ikke et nyt ansigt hver uge.",
  },
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    title: "Fuldt forsikret",
    desc: "Vi er forsikret op til 10 mio. kr. — så du er dækket, hvis der mod forventning sker uheld.",
  },
];

const STEPS_PRIVAT = [
  { n: "TRIN 01", title: "Bestil online eller ring", desc: "Vælg ydelse, areal og frekvens — eller ring til os, så hjælper vi med at finde det rette." },
  { n: "TRIN 02", title: "Fast pris med det samme", desc: "Du får en fast, gennemsigtig pris — ingen skjulte gebyrer, ingen overraskelser." },
  { n: "TRIN 03", title: "Vi kommer på aftalt tid", desc: "Samme rengøringsassistent hver gang, der lærer dit hjem at kende." },
  { n: "TRIN 04", title: "Tilfredshedsgaranti", desc: "Er du ikke tilfreds, kommer vi tilbage gratis og retter op inden for 24 timer." },
];

export default function Privat(_: Route.ComponentProps) {
  useSiteEffects();
  const privatServices = servicesFor("privat");

  return (
    <div className="page">
      <Header />
      <JsonLd data={pageSchema} />

      <main>
        {/* hero */}
        <header className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="eyebrow reveal">Privat rengøring</p>
              <h1 className="reveal d1">
                Et <span className="hl">skinnende</span> hjem — uden besværet
              </h1>
              <p className="hero-lead reveal d2">
                Vi tager os af rengøringen i dit hjem, så du kan bruge tiden på det vigtige.
                Fast personale, fleksible aftaler og svanemærkede produkter — i hele Danmark.
              </p>
              <div className="hero-cta reveal d3">
                <Link className="btn btn-primary" to="/priser?for=privat#beregner">
                  Beregn din pris <Arrow />
                </Link>
                <Link className="btn btn-ghost" to="/kontakt?audience=privat">
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
              <ImageFrame className="hero-img-frame" src={PHOTOS.heroPrivat} alt="Pænt og rent privat hjem med stue og sofa" />
            </div>
          </div>
        </header>

        {/* why */}
        <section className="blk wrap">
          <div className="why-grid">
            <div>
              <p className="eyebrow reveal">Hvorfor Define til dit hjem</p>
              <h2 className="reveal d1" style={{ fontSize: "var(--fs-display)", marginTop: 16 }}>
                En partner du kan stole på i dit eget hjem
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
                src={PHOTOS.heroPrivat}
                alt="Glade rengøringsassistenter i privat hjem"
                style={{ width: "100%", aspectRatio: "4/4.4", borderRadius: "var(--radius-3xl)" }}
              />
            </div>
          </div>
        </section>

        {/* services */}
        <section className="blk wrap" id="ydelser" style={{ paddingTop: 0 }}>
          <div className="shead reveal">
            <p className="eyebrow">Se vores ydelser</p>
            <h2>Hvad kan vi gøre for dit hjem?</h2>
            <p>Vælg en kategori for at læse mere og se vejledende priser inkl. moms.</p>
          </div>
          <div className="svc-grid">
            {privatServices.map((svc, i) => (
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
            <p className="eyebrow">Sådan kommer du i gang</p>
            <h2 style={{ fontSize: "var(--fs-display)" }}>Fra bestilling til rent hjem på 4 trin</h2>
          </div>
          <div className="steps">
            {STEPS_PRIVAT.map((s, i) => (
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
            <h2>Klar til et renere hjem?</h2>
            <p>Få et gratis, uforpligtende tilbud inden for 24 timer. Ingen binding — bare et renere hjem.</p>
            <div className="row">
              <Link className="btn btn-white btn-lg" to="/priser?for=privat#beregner">Beregn din pris <Arrow /></Link>
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
