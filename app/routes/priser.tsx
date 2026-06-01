import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/priser";
import { Link, useSearchParams } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/priser`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Priser & prisberegner — Define Cleaning Services ApS",
      description:
        "Få din pris på under et minut. Vælg ejendomstype, areal og frekvens — vi viser en gennemsigtig, vejledende pris. Ingen skjulte gebyrer.",
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
  name: "Priser – Define Cleaning Services ApS",
  description: "Gennemsigtige priser og interaktiv beregner for erhvervsrengøring.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Priser", item: PAGE_URL },
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

type Audience = "privat" | "erhverv";

type PropertyType = { rate: number; name: string; icon: React.ReactNode };

const TYPES_PRIVAT: PropertyType[] = [
  { rate: 2.4, name: "Lejlighed", icon: <path d="M3 21h18M6 21V7l12-4v18M10 9h0M14 9h0M10 13h0M14 13h0M10 17h0M14 17h0" /> },
  { rate: 2.6, name: "Hus", icon: <><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M9 21v-6h6v6" /></> },
  { rate: 2.9, name: "Sommerhus", icon: <><path d="M2 22h20M3 22V10l9-7 9 7v12" /><path d="M9 22v-5h6v5" /></> },
  { rate: 3.4, name: "Flytterengøring", icon: <path d="M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2z" /> },
];

const TYPES_ERHVERV: PropertyType[] = [
  { rate: 2.2, name: "Kontor", icon: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /> },
  { rate: 2.4, name: "Butik", icon: <path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" /> },
  { rate: 3.2, name: "Klinik", icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v6M9 11h6" /></> },
  { rate: 1.6, name: "Lager / industri", icon: <path d="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /> },
  { rate: 2.0, name: "Ejendom / trappe", icon: <path d="M3 9h18M9 21V9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /> },
];

type Freq = { mult: number; vpm: number; name: string };
const FREQS: Freq[] = [
  { mult: 0.78, vpm: 21.7, name: "Dagligt" },
  { mult: 0.85, vpm: 8.66, name: "2× om ugen" },
  { mult: 0.9, vpm: 4.33, name: "Ugentligt" },
  { mult: 1, vpm: 2.17, name: "Hver 14. dag" },
  { mult: 1.08, vpm: 1, name: "Månedligt" },
  { mult: 1.35, vpm: 0, name: "Engangs" },
];

type Addon = { name: string; add?: number; pct?: number; icon: React.ReactNode; sub: string };

const ADDONS_PRIVAT: Addon[] = [
  { name: "Vinduespolering", add: 149, sub: "+149 kr./besøg", icon: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" /> },
  { name: "Ovn & hvidevarer", add: 195, sub: "+195 kr./besøg", icon: <><path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" /></> },
  { name: "Tøjvask & stryg", add: 129, sub: "+129 kr./besøg", icon: <path d="M3 6h18M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6M9 10h6" /> },
  { name: "Terrasse & udeareal", add: 175, sub: "+175 kr./besøg", icon: <><path d="M12 2L2 12h3v8h14v-8h3z" /></> },
  { name: "Aften / weekend", pct: 0.15, sub: "+15% tillæg", icon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /> },
  { name: "Grøn rengøring +", add: 129, sub: "+129 kr./besøg", icon: <path d="M11 20A7 7 0 019 6c4-2 9-2 11 0 0 6-4 12-9 14zM4 21c2-5 5-8 8-10" /> },
];

const ADDONS_ERHVERV: Addon[] = [
  { name: "Vinduespolering", add: 149, sub: "+149 kr./besøg", icon: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" /> },
  { name: "Gulvbehandling", add: 199, sub: "+199 kr./besøg", icon: <path d="M3 9h18M3 15h18M9 3v18M15 3v18" /> },
  { name: "Køkken / kantine", add: 99, sub: "+99 kr./besøg", icon: <path d="M3 2v7c0 1 1 2 2 2s2-1 2-2V2M5 11v11M15 2c-1.5 0-3 2-3 5s1.5 4 3 4v11" /> },
  { name: "Hygiejnedokumentation", add: 79, sub: "+79 kr./besøg", icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M9 14l2 2 4-4" /></> },
  { name: "Aften / weekend", pct: 0.15, sub: "+15% tillæg", icon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /> },
  { name: "Grøn rengøring +", add: 129, sub: "+129 kr./besøg", icon: <path d="M11 20A7 7 0 019 6c4-2 9-2 11 0 0 6-4 12-9 14zM4 21c2-5 5-8 8-10" /> },
];

const PLANS = [
  {
    name: "Basis",
    desc: "Til mindre kontorer og butikker med fast, enkel rengøring.",
    price: "Fra 349",
    features: ["Op til 100 m²", "Gulve, støv & overflader", "Toilet & køkken", "Fleksibel tidsplan"],
    cta: "Vælg Basis",
  },
  {
    name: "Standard",
    desc: "Vores mest valgte aftale — komplet rengøring til de fleste virksomheder.",
    price: "Fra 549",
    features: ["Op til 250 m²", "Alt i Basis", "Vinduespolering indvendigt", "Fast kontaktperson", "Kvalitetstjek hver måned"],
    cta: "Vælg Standard",
    hot: true,
  },
  {
    name: "Premium",
    desc: "Til større erhverv, klinikker og særlige krav til dokumentation.",
    price: "Fra 849",
    features: ["Ubegrænset areal", "Alt i Standard", "INSTA 800-dokumentation", "Prioritet ved booking", "Dedikeret kundeansvarlig"],
    cta: "Vælg Premium",
  },
];

const EXTRAS = [
  { name: "Vinduespolering udvendigt", price: "Fra 295 kr.", icon: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" /> },
  { name: "Flytterengøring", price: "Fra 1.995 kr.", icon: <path d="M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2z" /> },
  { name: "Gulvbehandling & polish", price: "Fra 595 kr.", icon: <><path d="M12 2L2 7l10 5 10-5z" /><path d="M2 17l10 5 10-5" /></> },
  { name: "Terrasse & udeareal", price: "Fra 395 kr.", icon: <path d="M3 9h18M9 21V9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /> },
  { name: "Ovn & hvidevarer", price: "Fra 195 kr.", icon: <><path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" /></> },
  { name: "Industri-specialrengøring", price: "På forespørgsel", icon: <><path d="M12 2L2 7l10 5 10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></> },
];

const FAQS = [
  { q: "Hvad er inkluderet i prisen?", a: "Alle priser inkluderer rengøringsmidler, udstyr, fast team og løbende kvalitetstjek. Vi medbringer alt — I skal blot give os adgang til lokalerne.", open: true },
  { q: "Er beregneren bindende?", a: "Nej. Beregneren giver et vejledende estimat, så I hurtigt kan danne jer et overblik. Den endelige pris fastsættes efter et gratis, uforpligtende besøg, hvor vi ser lokalerne." },
  { q: "Hvor hurtigt kan I starte?", a: "Vi kan i de fleste tilfælde være i gang inden for en uge. Akutte opgaver løser vi ofte hurtigere — ring og hør nærmere." },
  { q: "Kan jeg ændre eller opsige aftalen?", a: "Ja. Faste aftaler kan opsiges med en måneds varsel, og enkelte besøg kan ændres op til 48 timer før uden beregning." },
  { q: "Bruger I miljøvenlige produkter?", a: "Altid. Vi benytter svanemærkede, godkendte midler, der er skånsomme over for mennesker, dyr og natur." },
];

const BASE = 199; // udkald/transport pr. besøg

function kr(n: number, round: number) {
  const rounded = Math.round(n / round) * round;
  return rounded.toLocaleString("da-DK") + " kr.";
}

function m2note(v: number) {
  if (v < 80) return "≈ lille kontor / klinik";
  if (v < 200) return "≈ mellemstort kontor";
  if (v < 500) return "≈ stor etage / butik";
  if (v < 1000) return "≈ flere etager";
  return "≈ stort erhvervsareal";
}

const WIZ_STEPS = [
  { label: "Type" },
  { label: "Ejendom" },
  { label: "Areal" },
  { label: "Frekvens" },
  { label: "Tilvalg" },
  { label: "Pris" },
] as const;

function Prisberegner() {
  const [searchParams] = useSearchParams();
  const initialAudience: Audience = searchParams.get("for") === "erhverv" ? "erhverv" : "privat";

  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [typeIdx, setTypeIdx] = useState(0);
  const [m2, setM2] = useState(80);
  const [freqIdx, setFreqIdx] = useState(2);
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());

  useEffect(() => {
    const param = searchParams.get("for");
    if (param === "privat" || param === "erhverv") {
      setAudience(param);
    }
  }, [searchParams]);

  useEffect(() => {
    setTypeIdx(0);
    setSelectedAddons(new Set());
    setM2(audience === "privat" ? 80 : 150);
  }, [audience]);

  const types = audience === "privat" ? TYPES_PRIVAT : TYPES_ERHVERV;
  const addons = audience === "privat" ? ADDONS_PRIVAT : ADDONS_ERHVERV;
  const type = types[typeIdx] ?? types[0];
  const freq = FREQS[freqIdx];

  const result = useMemo(() => {
    const fixedAdd = Array.from(selectedAddons).reduce((sum, i) => sum + (addons[i]?.add ?? 0), 0);
    const pctAddon = Array.from(selectedAddons).map((i) => addons[i]).find((a) => a?.pct !== undefined);
    let perVisit = (BASE + m2 * type.rate) * freq.mult + fixedAdd;
    if (pctAddon?.pct) perVisit *= 1 + pctAddon.pct;
    const oneOff = freq.vpm === 0;
    const perMonth = oneOff ? perVisit : perVisit * freq.vpm;
    return { perVisit, perMonth, oneOff };
  }, [m2, type.rate, freq.mult, freq.vpm, selectedAddons, addons]);

  const toggleAddon = (i: number) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const goNext = () => setStep((s) => Math.min(s + 1, WIZ_STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const goReset = () => {
    setStep(0);
    setSelectedAddons(new Set());
  };

  return (
    <div className="calc reveal">
      <div className="wiz-head">
        <div className="wiz-steps" aria-label="Trin">
          {WIZ_STEPS.map((s, i) => (
            <div
              key={s.label}
              className={`wiz-step${i === step ? " active" : ""}${i < step ? " done" : ""}`}
            >
              <div className="wiz-dot" aria-hidden="true"><span>{i + 1}</span></div>
              <div className="wiz-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wiz-body">
        <div className="wiz-count">Trin {step + 1} af {WIZ_STEPS.length}</div>

        {step === 0 && (
          <>
            <h3 className="wiz-title">Hvem er du?</h3>
            <p className="wiz-sub">Vi tilpasser priser og tilvalg efter, om det er til hjemmet eller virksomheden.</p>
            <div className="aud-grid">
              <button
                type="button"
                className={`aud-card${audience === "privat" ? " sel" : ""}`}
                onClick={() => setAudience("privat")}
                aria-pressed={audience === "privat"}
              >
                <span className="aud-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                    <path d="M9 21v-6h6v6" />
                  </svg>
                </span>
                <b>Privat</b>
                <span>Hjem, lejlighed, sommerhus</span>
              </button>
              <button
                type="button"
                className={`aud-card${audience === "erhverv" ? " sel" : ""}`}
                onClick={() => setAudience("erhverv")}
                aria-pressed={audience === "erhverv"}
              >
                <span className="aud-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                </span>
                <b>Erhverv</b>
                <span>Kontor, butik, klinik, ejendom</span>
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="wiz-title">Hvad skal vi rengøre?</h3>
            <p className="wiz-sub">Vælg den type, der passer bedst — vi tilpasser pris og opgaver derefter.</p>
            <div className="type-grid">
              {types.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={`type-card${i === typeIdx ? " sel" : ""}`}
                  onClick={() => setTypeIdx(i)}
                  aria-pressed={i === typeIdx}
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {t.icon}
                    </svg>
                  </span>
                  <b>{t.name.split(" / ")[0]}</b>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="wiz-title">Hvor stort er arealet?</h3>
            <p className="wiz-sub">Justér skyderen — vi viser en omtrentlig størrelseskategori for at hjælpe.</p>
            <div className="m2row">
              <span className="m2val tnum">{m2.toLocaleString("da-DK")}</span>
              <span className="m2unit">m²</span>
              <span className="m2note">{m2note(m2)}</span>
            </div>
            <input
              type="range"
              className="rng"
              min={20}
              max={2000}
              step={10}
              value={m2}
              onChange={(e) => setM2(parseInt(e.target.value, 10))}
              aria-label="Areal i m²"
            />
            <div className="rng-ends"><span>20 m²</span><span>2.000 m²</span></div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="wiz-title">Hvor ofte skal vi komme?</h3>
            <p className="wiz-sub">De fleste vælger ugentligt eller hver 14. dag. Du kan altid ændre det senere.</p>
            <div className="seg">
              {FREQS.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  className={i === freqIdx ? "sel" : ""}
                  onClick={() => setFreqIdx(i)}
                  aria-pressed={i === freqIdx}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="wiz-title">Tilvalg <span style={{ fontWeight: 600, color: "var(--text-mute)", fontSize: ".75em" }}>(valgfrit)</span></h3>
            <p className="wiz-sub">Læg ekstra ydelser oveni — eller spring videre, hvis du ikke har brug for nogen.</p>
            <div className="addons">
              {addons.map((a, i) => (
                <button
                  key={a.name}
                  type="button"
                  className={`addon${selectedAddons.has(i) ? " sel" : ""}`}
                  onClick={() => toggleAddon(i)}
                  aria-pressed={selectedAddons.has(i)}
                >
                  <span className="ai">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {a.icon}
                    </svg>
                  </span>
                  <span className="atxt">
                    <b>{a.name}</b>
                    <span>{a.sub}</span>
                  </span>
                  <span className="chk">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <aside className="calc-side" style={{ margin: "0 -1px", borderRadius: 16 }}>
            <p className="res-eyebrow">Estimeret pris · {audience === "privat" ? "Privat" : "Erhverv"}</p>
            <div className="res-price tnum">{kr(result.oneOff ? result.perVisit : result.perMonth, result.oneOff ? 5 : 10)}</div>
            <p className="res-per">{result.oneOff ? "engangspris · ekskl. moms" : "pr. måned · ekskl. moms"}</p>

            <div className="res-visit">
              <div>
                <div className="rv tnum">{kr(result.perVisit, 5)}</div>
                <span>pr. besøg</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="rv tnum">
                  {result.oneOff ? "1" : freq.vpm.toLocaleString("da-DK", { maximumFractionDigits: 1 })}
                </div>
                <span>besøg / måned</span>
              </div>
            </div>

            <div className="res-break">
              <div className="rb"><span>Type</span><span>{type.name}</span></div>
              <div className="rb"><span>Areal</span><span>{m2.toLocaleString("da-DK")} m²</span></div>
              <div className="rb"><span>Frekvens</span><span>{freq.name}</span></div>
              {selectedAddons.size > 0 && (
                <div className="rb"><span>Tilvalg</span><span>{selectedAddons.size} valgt</span></div>
              )}
            </div>

            <div className="res-cta">
              <Link className="btn btn-white btn-lg" to="/kontakt">
                Få præcist tilbud <Arrow />
              </Link>
              <a
                className="btn btn-lg"
                style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}
                href="tel:+4570123456"
              >
                Ring 70 12 34 56
              </a>
            </div>
            <p className="res-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Vejledende estimat. Endelig pris fastsættes efter et gratis besøg og afhænger af lokalernes tilstand.
            </p>
          </aside>
        )}
      </div>

      <div className="wiz-nav">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={goBack}>
            ← Tilbage
          </button>
        ) : <span />}
        <span className="spacer" />
        {step < WIZ_STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            Næste <Arrow />
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={goReset}>
            Start forfra
          </button>
        )}
      </div>
    </div>
  );
}

export default function Priser(_: Route.ComponentProps) {
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
              <b>Priser</b>
            </nav>
            <p className="eyebrow reveal">Priser & beregner</p>
            <h1 className="reveal d1">Få din pris på under et minut</h1>
            <p className="lead reveal d2">
              Ingen skjulte gebyrer, ingen overraskelser. Vælg din ejendomstype, justér arealet og
              se en vejledende pris med det samme — eller få et præcist, uforpligtende tilbud.
            </p>
          </div>
        </header>

        {/* PRISBEREGNER */}
        <section className="wrap" id="beregner" style={{ paddingBottom: "var(--pad-section)", scrollMarginTop: 120 }}>
          <Prisberegner />
        </section>

        {/* packages */}
        <section className="blk wrap" style={{ paddingTop: 0 }}>
          <div className="shead center reveal">
            <p className="eyebrow">Faste pakker</p>
            <h2>Vælg en pakke — eller få den skræddersyet</h2>
            <p>Alle pakker inkluderer midler, udstyr, fast team og kvalitetstjek. Priser er ekskl. moms.</p>
          </div>
          <div className="plans">
            {PLANS.map((plan, i) => (
              <div key={plan.name} className={`plan reveal${i ? ` d${i}` : ""}${plan.hot ? " hot" : ""}`}>
                {plan.hot && <span className="plan-badge">Mest populær</span>}
                <h3>{plan.name}</h3>
                <p className="pd">{plan.desc}</p>
                <div className="price">
                  <b>{plan.price}</b>
                  <span>kr./besøg</span>
                </div>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="pk"><Check /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link className={plan.hot ? "btn btn-white" : "btn btn-ghost"} to="/kontakt">
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* extras */}
        <section className="blk" style={{ background: "var(--bg-sunken)", paddingBlock: "var(--pad-section)" }}>
          <div className="wrap">
            <div className="shead center reveal">
              <p className="eyebrow">Tillægstjenester</p>
              <h2>Tilføj efter behov</h2>
            </div>
            <div className="extras reveal d1">
              {EXTRAS.map((e) => (
                <div className="extra" key={e.name}>
                  <span className="en">
                    <span className="ei">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {e.icon}
                      </svg>
                    </span>
                    {e.name}
                  </span>
                  <span className="ep">{e.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* faq */}
        <section className="blk wrap">
          <div className="shead center reveal">
            <p className="eyebrow">Spørgsmål & svar</p>
            <h2>Ofte stillede spørgsmål</h2>
          </div>
          <div className="faq reveal d1">
            {FAQS.map((f) => (
              <details className="qa" key={f.q} open={f.open}>
                <summary>
                  {f.q}
                  <span className="pl" />
                </summary>
                <div className="qa-body">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="blk wrap" style={{ paddingTop: 0 }}>
          <div className="ctaband reveal">
            <h2>Klar til at komme i gang?</h2>
            <p>Få et gratis og uforpligtende tilbud inden for 24 timer — skræddersyet til netop jeres lokaler.</p>
            <div className="row">
              <Link className="btn btn-white btn-lg" to="/kontakt">Få et gratis tilbud</Link>
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
