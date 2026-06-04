import type { Route } from "./+types/index";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
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
  "@type": "WebSite",
  name: "Define Cleaning Services ApS",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/tjenester?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

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
    quote: "Vi har haft Define hjemme hver 14. dag i to år. Samme rengøringsassistent hver gang, og hjemmet er altid skinnende rent.",
    name: "Camilla Holm",
    role: "Privatkunde, Hellerup",
    initials: "CH",
  },
];

const STATS = [
  { count: 500, decimals: 0, suffix: "+", label: "Faste kunder" },
  { count: 20, decimals: 0, suffix: "", label: "Års erfaring" },
  { count: 1.8, decimals: 1, suffix: "M", label: "m² rengjort årligt" },
  { count: 4.9, decimals: 1, suffix: "", label: "Trustpilot-score" },
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

  return (
    <div className="page">
      <Header />
      <JsonLd data={websiteSchema} />

      <main>
        {/* full-screen split hero — Privat / Erhverv */}
        <section className="splithero" aria-label="Vælg Privat eller Erhverv">
          <Link to="/privat" className="splithero-half splithero-privat reveal" style={{ backgroundImage: `url(${PHOTOS.heroPrivat})` }}>
            <div className="splithero-content">
              <p className="eyebrow">Til private hjem</p>
              <h2>Kom hjem til rent</h2>
              <p>Fast rengøring, hovedrengøring, fraflytning og vinduespudsning — udført af et fast, trygt team i hele Danmark.</p>
              <span className="splithero-cta">Se privatløsninger <Arrow /></span>
            </div>
          </Link>
          <Link to="/erhverv" className="splithero-half splithero-erhverv reveal d1" style={{ backgroundImage: `url(${PHOTOS.heroErhverv})` }}>
            <div className="splithero-content">
              <p className="eyebrow">Til virksomheder</p>
              <h2>Rene rammer for forretning</h2>
              <p>Kontor, butik, klinik og industri — INSTA 800-dokumenteret rengøring, der løfter jeres indtryk hver dag.</p>
              <span className="splithero-cta">Se erhvervsløsninger <Arrow /></span>
            </div>
          </Link>
        </section>

        {/* intro under hero */}
        <section className="wrap" style={{ paddingBlock: "clamp(48px, 6vw, 80px)", textAlign: "center" }}>
          <p className="eyebrow reveal">Define Cleaning Services</p>
          <h1 className="reveal d1" style={{ fontSize: "var(--fs-display)", maxWidth: "18ch", margin: "16px auto 0", marginInline: "auto" }}>
            Rengøring du kan stole på — privat og erhverv
          </h1>
          <p className="hero-lead reveal d2" style={{ maxWidth: 640, margin: "20px auto 28px" }}>
            Professionel rengøring i hele Danmark. Fast team, svanemærkede produkter og 20 års erfaring —
            både i dit hjem og i din virksomhed.
          </p>
          <div className="splash-rating reveal d3">
            <StarRow />
            <span className="rtxt"><b>4,9/5</b> på Trustpilot · baseret på <b>512</b> anmeldelser</span>
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
                Vestjylland — samme høje standard, uanset hvor du holder til.
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

        {/* dual CTA — both audiences */}
        <section className="blk wrap" id="kontakt">
          <div className="dual-cta">
            <Link to="/privat" className="dual-cta-card privat reveal">
              <h3>Privat</h3>
              <p>Klar til et renere hjem?</p>
              <span className="splash-card-cta">Se mere <Arrow /></span>
            </Link>
            <Link to="/erhverv" className="dual-cta-card erhverv reveal d1">
              <h3>Erhverv</h3>
              <p>Klar til et renere arbejdsmiljø?</p>
              <span className="splash-card-cta">Se mere <Arrow /></span>
            </Link>
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
          fill="rgba(75,147,99,0.22)"
          style={{ animationDelay: `${((i * 53) % 100) / 100 * 4.2}s` }}
        />
      ))}
      {cities.map((c, i) => (
        <g key={c.name}>
          <circle className="dk-ring" cx={c.x} cy={c.y} r={5} fill="#4b9363" opacity={0}>
            <animate attributeName="r" values="5;24;24" dur="2.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0;0" dur="2.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle className="dk-city-glow" cx={c.x} cy={c.y} r={9} fill="#4b9363" style={{ animationDelay: `${i * 0.4}s` }} />
          <circle cx={c.x} cy={c.y} r={5} fill="#3f7e54" />
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
