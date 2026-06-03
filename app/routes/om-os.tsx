import type { Route } from "./+types/om-os";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { ImageFrame } from "~/components/ImageFrame";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { PHOTOS } from "~/lib/photos";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/om-os`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Om os — Define Cleaning Services ApS",
      description:
        "20 års erfaring med rent arbejde og glade kunder. Vi er et landsdækkende rengøringsfirma med fast team, INSTA 800-kvalitet og svanemærkede produkter.",
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
  name: "Om os – Define Cleaning Services ApS",
  description: "Lær Define Cleaning Services ApS at kende.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Om os", item: PAGE_URL },
    ],
  },
};

const STATS = [
  { count: 20, decimals: 0, suffix: "", label: "Års erfaring" },
  { count: 500, decimals: 0, suffix: "+", label: "Faste kunder" },
  { count: 65, decimals: 0, suffix: "", label: "Medarbejdere" },
  { count: 95, decimals: 0, suffix: "+", label: "Byer dækket" },
];

const TIMELINE = [
  { year: "2010", title: "Det hele begynder", desc: "To fagfolk, én varevogn og de første kontorer i København." },
  { year: "2014", title: "Certificeret efter INSTA 800", desc: "Vi indfører dokumenteret kvalitetsstyring på hver eneste opgave." },
  { year: "2018", title: "100 faste erhvervskunder", desc: "Vi udvider til Aarhus og Odense og bliver svanemærket-leverandør." },
  { year: "2022", title: "Landsdækkende", desc: "Teams i hele Danmark — fra hovedstaden til Vestjylland." },
  { year: "I dag", title: "500+ kunder & 4,9 på Trustpilot", desc: "Samme ambition som dag ét: grundigt, ordentligt, til tiden." },
];

const VALUES = [
  {
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
    title: "Kvalitet, der kan måles",
    desc: "Vi arbejder efter INSTA 800 og dokumenterer hvert besøg. Er du ikke tilfreds, kommer vi tilbage — gratis.",
  },
  {
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    title: "Faste, dygtige mennesker",
    desc: "Samme team hver gang, oplært i jeres lokaler. Ordentlige løn- og arbejdsvilkår — det kan mærkes på kvaliteten.",
  },
  {
    icon: <path d="M11 20A7 7 0 019 6c4-2 9-2 11 0 0 6-4 12-9 14zM4 21c2-5 5-8 8-10" />,
    title: "Grønt som standard",
    desc: "Svanemærkede midler og effektive metoder, der er skånsomme mod både mennesker og miljø.",
  },
];

const CERTS = [
  { title: "INSTA 800", sub: "Kvalitetsstandard", icon: <><circle cx="12" cy="8" r="6" /><path d="M9 13.5L7 22l5-3 5 3-2-8.5" /></> },
  { title: "Svanemærket", sub: "Miljøcertificeret", icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /> },
  { title: "ISO 9001", sub: "Kvalitetsledelse", icon: <path d="M20 6L9 17l-5-5" /> },
  { title: "Forsikret", sub: "Op til 10 mio. kr.", icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
];

export default function OmOs(_: Route.ComponentProps) {
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
              <b>Om os</b>
            </nav>
            <p className="eyebrow reveal">Om os</p>
            <h1 className="reveal d1">20 års erfaring med rent arbejde — og glade kunder</h1>
            <p className="lead reveal d2">
              Vi har hjulpet danske virksomheder og privatkunder med at tage sig godt ud i to årtier.
              Vi startede med ét team og én varevogn. I dag rengør vi for over 500 kunder i hele landet —
              men ambitionen er den samme: at gøre det grundigt, og at gøre det ordentligt.
            </p>
          </div>
        </header>

        {/* story */}
        <section className="wrap" style={{ paddingBottom: "var(--pad-section)" }}>
          <div className="story">
            <div className="reveal">
              <ImageFrame src={PHOTOS.story} alt="Holdet på arbejde" />
            </div>
            <div className="reveal d1">
              <p className="eyebrow">Vores historie</p>
              <h2 style={{ marginTop: 14 }}>Bygget på tillid, ét rent lokale ad gangen</h2>
              <p>
                Define Cleaning Services blev grundlagt af to fagfolk med en simpel idé: rengøring skal være
                til at stole på. Ingen skjulte gebyrer, ingen udskiftning af personale hver uge —
                bare et fast team, der kender jeres lokaler og leverer samme høje standard hver gang.
              </p>
              <p>
                I dag er vi vokset til et landsdækkende hold, men vi driver stadig firmaet som en
                lokal partner. Det er derfor 98% af vores kunder bliver hos os år efter år.
              </p>
            </div>
          </div>
        </section>

        {/* stats */}
        <section className="statsband">
          <div className="wrap statsgrid">
            {STATS.map((s, i) => (
              <div key={s.label} className={`stat reveal${i ? ` d${i}` : ""}`}>
                <div className="v">
                  <span data-count={s.count} data-decimals={s.decimals} className="tnum">0</span>
                  {s.suffix && <span className="u">{s.suffix}</span>}
                </div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* timeline */}
        <section className="blk wrap">
          <div className="shead center reveal">
            <p className="eyebrow">Rejsen</p>
            <h2>Fra varevogn til landsdækkende</h2>
          </div>
          <div className="tl">
            {TIMELINE.map((t, i) => (
              <div key={t.year} className={`tl-item reveal${i ? ` d${i}` : ""}`}>
                <div className="tl-year">{t.year}</div>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* values */}
        <section className="blk" style={{ background: "var(--bg-sunken)", paddingBlock: "var(--pad-section)" }}>
          <div className="wrap">
            <div className="shead center reveal">
              <p className="eyebrow">Det vi står for</p>
              <h2>Tre løfter, vi aldrig går på kompromis med</h2>
            </div>
            <div className="vals">
              {VALUES.map((v, i) => (
                <div key={v.title} className={`val reveal${i ? ` d${i}` : ""}`}>
                  <div className="vi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {v.icon}
                    </svg>
                  </div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* certs */}
        <section className="blk" style={{ background: "var(--bg-sunken)", paddingBlock: "var(--pad-section)" }}>
          <div className="wrap">
            <div className="shead center reveal">
              <p className="eyebrow">Certificeringer</p>
              <h2>Dokumenteret, forsikret og godkendt</h2>
            </div>
            <div className="certs reveal d1" style={{ gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 900, marginInline: "auto" }}>
              {CERTS.map((c) => (
                <div key={c.title} className="cert">
                  <div className="cert-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {c.icon}
                    </svg>
                  </div>
                  <b>{c.title}</b>
                  <span>{c.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="blk wrap">
          <div className="ctaband reveal">
            <h2>Skal vi også tage os af jeres lokaler?</h2>
            <p>Få et gratis tilbud, eller beregn en vejledende pris på under et minut.</p>
            <div className="row">
              <Link className="btn btn-white btn-lg" to="/priser#beregner">Beregn din pris</Link>
              <Link
                className="btn btn-lg"
                style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}
                to="/kontakt"
              >
                Kontakt os
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
