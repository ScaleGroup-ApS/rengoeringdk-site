import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/tjenester";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { SERVICES, type Audience } from "~/lib/services";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/tjenester`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Alle ydelser — Define Cleaning Services ApS",
      description:
        "Se hele vores udvalg af rengøringsydelser. Fra kontor og butik til hjemmerengøring, flytte- og hovedrengøring. 18 specialiserede kategorier i hele Danmark.",
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
  "@type": "CollectionPage",
  name: "Alle ydelser – Define Cleaning Services ApS",
  description: "Professionel rengøring for både privat og erhverv.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tjenester", item: PAGE_URL },
    ],
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

type Filter = "alle" | Audience;

export default function Tjenester(_: Route.ComponentProps) {
  useSiteEffects();
  const [filter, setFilter] = useState<Filter>("alle");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = SERVICES.filter((s) => {
    if (filter === "alle") return true;
    if (filter === "privat") return s.audience === "privat" || s.audience === "both";
    if (filter === "erhverv") return s.audience === "erhverv" || s.audience === "both";
    return true;
  });

  // The global reveal observer only runs once on mount, so cards added when the
  // filter changes never get the `in` class and would stay hidden. Reveal the
  // current set of cards on every filter change (and on first mount).
  useEffect(() => {
    gridRef.current
      ?.querySelectorAll<HTMLElement>(".svc.reveal")
      .forEach((el) => el.classList.add("in"));
  }, [filter]);

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
              <b>Tjenester</b>
            </nav>
            <p className="eyebrow reveal">Vores ydelser</p>
            <h1 className="reveal d1">Alle vores rengøringsydelser</h1>
            <p className="lead reveal d2">
              Vi dækker hele spektret — fra det private hjem til store erhvervslejemål.
              Klik på en kategori for at læse mere og se vejledende priser.
            </p>

            <div className="aud-toggle reveal" role="tablist" aria-label="Vis ydelser for" style={{ marginTop: 28 }}>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "alle"}
                className={filter === "alle" ? "sel" : ""}
                onClick={() => setFilter("alle")}
              >
                Alle
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "privat"}
                className={filter === "privat" ? "sel" : ""}
                onClick={() => setFilter("privat")}
              >
                Privat
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "erhverv"}
                className={filter === "erhverv" ? "sel" : ""}
                onClick={() => setFilter("erhverv")}
              >
                Erhverv
              </button>
            </div>
          </div>
        </header>

        <section className="wrap" style={{ paddingBottom: "var(--pad-section)" }}>
          <div className="svc-grid" ref={gridRef}>
            {filtered.map((svc, i) => (
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

        <section className="blk wrap" style={{ paddingTop: 0 }}>
          <div className="ctaband reveal">
            <h2>Ikke sikker på, hvad I har brug for?</h2>
            <p>Beregn en vejledende pris på under et minut — eller ring, så finder vi den rette løsning sammen.</p>
            <div className="row">
              <Link className="btn btn-white btn-lg" to="/priser#beregner">Beregn din pris <Arrow /></Link>
              <a
                className="btn btn-lg"
                style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}
                href="tel:+4570123456"
              >
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
