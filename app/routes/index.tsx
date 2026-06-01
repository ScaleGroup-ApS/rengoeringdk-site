import type { Route } from "./+types/index";
import { Link } from "react-router";
import { useState } from "react";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { ImageFrame } from "~/components/ImageFrame";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { PHOTOS } from "~/lib/photos";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Define Cleaning Services ApS — Rengøring for privat & erhverv",
      description:
        "Professionel rengøring i hele Danmark — til både private hjem og virksomheder. Fast team, fleksible aftaler og svanemærkede produkter.",
      url: SITE_URL,
      siteName: "Define Cleaning Services ApS",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: SITE_URL },
  ];
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Define Cleaning Services ApS – Rengøring for privat & erhverv",
  description:
    "Professionel rengøring i hele Danmark — til både private hjem og virksomheder. Fast team, dokumenteret kvalitet og svanemærkede produkter.",
  url: SITE_URL,
};

const AUDIENCE_COPY = {
  privat: {
    eyebrow: "Hjemmerengøring i hele Danmark",
    h1Pre: "Et ",
    h1Hl: "skinnende",
    h1Post: " hjem — uden besværet",
    lead:
      "Vi tager os af rengøringen i dit hjem, så du kan bruge tiden på det vigtige. Fast personale, fleksible aftaler og svanemærkede produkter.",
    ctaPrimary: "Få et tilbud",
    ctaSecondary: "Se priser",
    imageAlt: "Lyst, rent privat hjem med store vinduer",
  },
  erhverv: {
    eyebrow: "Erhvervsrengøring i hele Danmark",
    h1Pre: "Et ",
    h1Hl: "skinnende",
    h1Post: " indtryk — hver eneste dag",
    lead:
      "Vi holder kontorer, klinikker og butikker rene for over 500 danske virksomheder. Fast team, fleksible aftaler og dokumenteret kvalitet efter INSTA 800.",
    ctaPrimary: "Beregn din pris",
    ctaSecondary: "Se vores ydelser",
    imageAlt: "Lyst, rent kontor med store vinduer",
  },
} as const;

type Audience = keyof typeof AUDIENCE_COPY;

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SERVICES = [
  {
    icon: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />,
    title: "Kontorrengøring",
    desc: "Daglig eller ugentlig rengøring uden for arbejdstid — så I møder ind til et friskt og repræsentativt kontor.",
  },
  {
    icon: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" />,
    title: "Vinduespolering",
    desc: "Streg- og pletfri facader, butiksruder og glaspartier — indvendigt og udvendigt, også i højde.",
  },
  {
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
    title: "Klinik & sundhed",
    desc: "Dokumenteret hygiejnerengøring til klinikker, tandlæger og institutioner med skærpede krav.",
  },
  {
    icon: <path d="M3 9h18M9 21V9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    title: "Trappevask",
    desc: "Faste aftaler for ejendomme og boligforeninger — rene trapper, elevatorer og fællesarealer.",
  },
  {
    icon: <path d="M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2z" />,
    title: "Flytterengøring",
    desc: "Grundig fraflytningsrengøring til erhvervslejemål — afleveret efter aftale, klar til syn.",
  },
  {
    icon: <path d="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    title: "Industri & lager",
    desc: "Specialrengøring af produktion, lager og haller med professionelt udstyr og sikkerhed i top.",
  },
];

const TRUST_POINTS = [
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    title: "Fuldt forsikret & kvalitetssikret",
    desc: "Vi arbejder efter INSTA 800 og dokumenterer hvert besøg, så I altid kan se kvaliteten sort på hvidt.",
  },
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    title: "Fast team & fast kontaktperson",
    desc: "Samme dygtige medarbejdere hver gang — og én person I altid kan ringe til.",
  },
  {
    icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
    title: "Svanemærkede produkter",
    desc: "Skånsomt for mennesker og miljø — uden at gå på kompromis med det rene resultat.",
  },
];

const CERTS = [
  {
    icon: <><circle cx="12" cy="8" r="6" /><path d="M9 13.5L7 22l5-3 5 3-2-8.5" /></>,
    title: "INSTA 800",
    sub: "Kvalitetsstandard",
  },
  {
    icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
    title: "Svanemærket",
    sub: "Miljøcertificeret",
  },
  {
    icon: <path d="M20 6L9 17l-5-5" />,
    title: "ISO 9001",
    sub: "Kvalitetsledelse",
  },
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    title: "Forsikret",
    sub: "Op til 10 mio. kr.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Vores kontor har aldrig været renere. Teamet er diskret, grundigt og altid til tiden. Vi anbefaler dem varmt.",
    name: "Mette Sørensen",
    role: "Facility Manager, Nordhavn Group",
    initials: "MS",
  },
  {
    quote: "Skift til Define var den bedste beslutning. Fast kontaktperson, og kvaliteten er konsekvent måned efter måned.",
    name: "Jonas Brandt",
    role: "Ejer, Habit Retail",
    initials: "JB",
  },
  {
    quote: "Professionelle fra første kontakt. De forstod vores hygiejnekrav som klinik og leverer hver gang upåklageligt.",
    name: "Camilla Holm",
    role: "Klinikleder, Klinik Sund",
    initials: "CH",
  },
];

const CLIENT_LOGOS = [
  { shape: <circle cx="12" cy="12" r="10" />, name: "Nordhavn Group" },
  { shape: <rect x="3" y="3" width="18" height="18" rx="4" />, name: "Bolig&Co" },
  { shape: <path d="M12 2l9 5v10l-9 5-9-5V7z" />, name: "Mejlby A/S" },
  { shape: <path d="M3 12h18M12 3v18" />, name: "Klinik Sund" },
  { shape: <polygon points="12,2 22,20 2,20" />, name: "Vestas Kontor" },
  { shape: <circle cx="12" cy="12" r="9" />, name: "Habit Retail" },
  { shape: <rect x="4" y="4" width="16" height="16" rx="8" />, name: "Nordisk Tech" },
];

const STATS = [
  { count: 500, decimals: 0, suffix: "+", label: "Faste erhvervskunder" },
  { count: 15, decimals: 0, suffix: "", label: "Års erfaring" },
  { count: 1.8, decimals: 1, suffix: "M", label: "m² rengjort årligt" },
  { count: 4.9, decimals: 1, suffix: "", label: "Trustpilot-score" },
];

const STEPS = [
  { n: "TRIN 01", title: "Uforpligtende besøg", desc: "Vi kommer forbi, ser lokalerne og lytter til jeres behov." },
  { n: "TRIN 02", title: "Skræddersyet tilbud", desc: "I får en fast, gennemsigtig pris inden for 24 timer." },
  { n: "TRIN 03", title: "Opstart med fast team", desc: "Samme medarbejdere hver gang — oplært i jeres lokaler." },
  { n: "TRIN 04", title: "Løbende kvalitetstjek", desc: "Vi dokumenterer og følger op, så standarden holder." },
];

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <span className="stars">
      {Array.from({ length: count }, (_, i) => <Star key={i} />)}
    </span>
  );
}

export default function Index(_: Route.ComponentProps) {
  useSiteEffects();
  const [audience, setAudience] = useState<Audience>("privat");
  const copy = AUDIENCE_COPY[audience];

  return (
    <div className="page">
      <Header />
      <JsonLd data={websiteSchema} />

      <main>
        {/* hero */}
        <header className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="aud-toggle reveal" role="tablist" aria-label="Vælg målgruppe">
                <button
                  type="button"
                  role="tab"
                  aria-selected={audience === "privat"}
                  className={audience === "privat" ? "sel" : ""}
                  onClick={() => setAudience("privat")}
                >
                  Privat
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={audience === "erhverv"}
                  className={audience === "erhverv" ? "sel" : ""}
                  onClick={() => setAudience("erhverv")}
                >
                  Erhverv
                </button>
              </div>
              <p className="eyebrow reveal">{copy.eyebrow}</p>
              <h1 className="reveal d1">
                {copy.h1Pre}<span className="hl">{copy.h1Hl}</span>{copy.h1Post}
              </h1>
              <p className="hero-lead reveal d2">{copy.lead}</p>
              <div className="hero-cta reveal d3">
                <Link className="btn btn-primary" to="/priser#beregner">
                  {copy.ctaPrimary} <Arrow />
                </Link>
                <Link className="btn btn-ghost" to={audience === "privat" ? "/priser" : "/tjenester"}>
                  {copy.ctaSecondary}
                </Link>
              </div>
              <div className="trust-marks reveal d4">
                <span className="tm-label">Certificeret af</span>
                <span className="trust-mark svane" title="Svanemærket — det nordiske miljømærke">
                  <span className="tm-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-2 5-6 6-6 11a6 6 0 0012 0c0-5-4-6-6-11z"/></svg>
                  </span>
                  Svanemærket
                </span>
                <span className="trust-mark servn" title="Medlem af Servicenormen">
                  <span className="tm-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  Servicenormen
                </span>
              </div>
              <div className="hero-rating reveal d4" style={{ marginTop: 20 }}>
                <StarRow />
                <span className="rtxt">
                  <b>4,9/5</b> på Trustpilot · baseret på <b>512</b> anmeldelser
                </span>
              </div>
            </div>

            <div className="hero-media reveal d2">
              <ImageFrame className="hero-img-frame" src={PHOTOS.hero} alt={copy.imageAlt} />
              <div className="float-card tl">
                <span className="fc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <div className="fc-big tnum">98%</div>
                  <div className="fc-sub">fastholder os år efter år</div>
                </div>
              </div>
              <div className="float-card br">
                <div className="fc-big tnum">15 år</div>
                <div className="fc-sub">i branchen siden 2010</div>
              </div>
            </div>
          </div>
        </header>

        {/* logo wall */}
        <section className="logos" aria-label="Kunder">
          <p className="logos-label reveal">
            Betroet af <b>500+ virksomheder</b> — fra startups til børsnoterede
          </p>
          <div className="marquee">
            <div className="marquee-track">
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
                <span className="clientlogo" key={i}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{logo.shape}</svg>
                  {logo.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* stats band */}
        <section className="statsband" aria-label="Nøgletal">
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

        {/* services */}
        <section className="blk wrap" id="tjenester">
          <div className="shead reveal">
            <p className="eyebrow">Vores ydelser</p>
            <h2>Rengøring til både hjem og erhverv</h2>
            <p>
              Fra det daglige kontor og hjemmerengøring til specialopgaver med høje hygiejnekrav.
              Vi sammensætter en aftale, der passer præcis til dig og dit budget.
            </p>
          </div>
          <div className="svc-grid">
            {SERVICES.map((svc, i) => (
              <article key={svc.title} className={`svc reveal${i % 3 ? ` d${i % 3}` : ""}`} data-tilt="4">
                <div className="svc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {svc.icon}
                  </svg>
                </div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <Link to="/tjenester" className="more">
                  Læs mere <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* why + certs */}
        <section className="blk wrap">
          <div className="why-grid">
            <div>
              <p className="eyebrow reveal">Hvorfor Define</p>
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
            <div className="certs reveal d2">
              {CERTS.map((c) => (
                <div className="cert" key={c.title}>
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

        {/* coverage */}
        <section className="blk cover" id="dækning">
          <div className="wrap cover-grid">
            <div>
              <p className="eyebrow reveal">Dækning</p>
              <h2 className="reveal d1" style={{ fontSize: "var(--fs-display)", marginTop: 16 }}>
                Vi rengør i hele Danmark
              </h2>
              <p className="reveal d2" style={{ fontSize: "var(--fs-lead)", color: "var(--text-dim)", marginTop: 18, lineHeight: 1.5 }}>
                Med teams fordelt over hele landet er vi aldrig langt væk. Fra hovedstaden til
                Vestjylland — samme høje standard, uanset hvor I holder til.
              </p>
              <div className="cities reveal d3">
                {["København", "Aarhus", "Odense", "Aalborg", "Esbjerg", "+ 90 byer"].map((c) => (
                  <span className="city-chip" key={c}><i />{c}</span>
                ))}
              </div>
            </div>
            <div className="map reveal d2">
              <DKMap />
            </div>
          </div>
        </section>

        {/* testimonials */}
        <section className="blk wrap" id="anmeldelser">
          <div className="shead center reveal">
            <p className="eyebrow">Anmeldelser</p>
            <h2>Det siger vores kunder</h2>
            <p>Gennemsnitlig 4,9 ud af 5 stjerner på tværs af Trustpilot og Google.</p>
          </div>
          <div className="tcards">
            {TESTIMONIALS.map((t, i) => (
              <article key={t.name} className={`tcard reveal${i ? ` d${i}` : ""}`}>
                <StarRow />
                <blockquote>“{t.quote}”</blockquote>
                <div className="who">
                  <div className="avatar" aria-hidden="true">{t.initials}</div>
                  <div>
                    <b>{t.name}</b>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* process */}
        <section className="blk wrap">
          <div className="shead reveal">
            <p className="eyebrow">Sådan kommer I i gang</p>
            <h2 style={{ fontSize: "var(--fs-display)" }}>Fra tilbud til rent kontor på 4 trin</h2>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s.n} className={`step reveal${i ? ` d${i}` : ""}`}>
                <div className="n">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="blk wrap" id="kontakt">
          <div className="ctaband reveal">
            <h2>Klar til et renere arbejdsmiljø?</h2>
            <p>Få et gratis, uforpligtende tilbud inden for 24 timer. Ingen binding — bare et renere kontor.</p>
            <div className="row">
              <a className="btn btn-white" href="tel:+4570123456">Ring 70 12 34 56</a>
              <a
                className="btn"
                style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}
                href="mailto:info@define-cleaning.dk"
              >
                Skriv til os
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Static SVG map of Denmark ───────────────────────────────────────── */
function DKMap() {
  const cities = [
    { x: 505, y: 282, name: "København", anchor: "start" as const },
    { x: 238, y: 248, name: "Aarhus", anchor: "start" as const },
    { x: 335, y: 322, name: "Odense", anchor: "start" as const },
    { x: 214, y: 128, name: "Aalborg", anchor: "start" as const },
    { x: 138, y: 344, name: "Esbjerg", anchor: "start" as const },
  ];
  const regions: Array<[number, number, number, number]> = [
    [190, 295, 80, 120],
    [245, 240, 52, 88],
    [212, 132, 46, 72],
    [232, 70, 18, 30],
    [150, 350, 38, 40],
    [335, 322, 44, 36],
    [470, 288, 54, 54],
    [452, 372, 52, 18],
    [575, 332, 13, 14],
  ];
  const inRegions = (x: number, y: number) => {
    for (const [cx, cy, rx, ry] of regions) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) return true;
    }
    return false;
  };
  const dots: Array<{ x: number; y: number }> = [];
  for (let y = 30; y < 440; y += 15) {
    for (let x = 90; x < 600; x += 15) {
      const jx = x + (((x * 7 + y) % 5) - 2) * 0.6;
      const jy = y + (((y * 5 + x) % 5) - 2) * 0.6;
      if (inRegions(jx, jy)) dots.push({ x: jx, y: jy });
    }
  }

  return (
    <svg viewBox="0 0 600 480" width="100%" style={{ height: "auto", overflow: "visible" }} role="img" aria-label="Dækningskort over Danmark">
      <style>{`
        @keyframes dkDotBreathe {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 0.55; }
        }
        @keyframes dkCityGlow {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 0.40; }
        }
        .dk-dot       { animation: dkDotBreathe 4.2s ease-in-out infinite; }
        .dk-city-glow { animation: dkCityGlow 2.8s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        @media (prefers-reduced-motion: reduce) {
          .dk-dot, .dk-city-glow { animation: none; }
          .dk-ring { display: none; }
        }
      `}</style>
      {dots.map((d, i) => (
        <circle
          key={i}
          className="dk-dot"
          cx={d.x.toFixed(1)}
          cy={d.y.toFixed(1)}
          r={2.4}
          fill="rgba(8,106,119,0.20)"
          style={{ animationDelay: `${((i * 53) % 100) / 100 * 4.2}s` }}
        />
      ))}
      {cities.map((c, i) => (
        <g key={c.name}>
          <circle className="dk-ring" cx={c.x} cy={c.y} r={5} fill="#0EA5B7" opacity={0}>
            <animate attributeName="r" values="5;24;24" dur="2.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0;0" dur="2.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle className="dk-city-glow" cx={c.x} cy={c.y} r={9} fill="#0EA5B7" style={{ animationDelay: `${i * 0.4}s` }} />
          <circle cx={c.x} cy={c.y} r={5} fill="#0EA5B7" />
          <text
            x={c.x + 12}
            y={c.y + 4}
            textAnchor={c.anchor}
            fill="#06262B"
            fontSize="15"
            fontWeight="700"
            fontFamily="'Inter', sans-serif"
          >
            {c.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
