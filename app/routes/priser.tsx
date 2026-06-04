import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Route } from "./+types/priser";
import { Link, useSearchParams } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { SERVICES_BY_SLUG, type Audience as ServiceAudience } from "~/lib/services";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/priser`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Priser & beregner — Define Cleaning Services ApS",
      description:
        "Få en vejledende pris på under et minut — for både privat og erhverv. Privatpriser inkl. moms, erhvervspriser ekskl. moms. Ingen skjulte gebyrer.",
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
  description: "Gennemsigtige priser og interaktiv beregner for både privat og erhverv.",
  url: PAGE_URL,
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

type WizAudience = "privat" | "erhverv";
type PropertyType = { rate: number; name: string; icon: React.ReactNode };

const TYPES_PRIVAT: PropertyType[] = [
  { rate: 2.4, name: "Lejlighed", icon: <path d="M3 21h18M6 21V7l12-4v18" /> },
  { rate: 2.6, name: "Hus", icon: <><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M9 21v-6h6v6" /></> },
  { rate: 2.9, name: "Sommerhus", icon: <><path d="M2 22h20M3 22V10l9-7 9 7v12" /></> },
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
  { name: "Vinduespolering", add: 149, sub: "+149 kr.", icon: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" /> },
  { name: "Ovn & hvidevarer", add: 195, sub: "+195 kr.", icon: <><path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" /></> },
  { name: "Tøjvask & stryg", add: 129, sub: "+129 kr.", icon: <path d="M3 6h18M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6M9 10h6" /> },
  { name: "Terrasse & udeareal", add: 175, sub: "+175 kr.", icon: <path d="M12 2L2 12h3v8h14v-8h3z" /> },
];

const ADDONS_ERHVERV: Addon[] = [
  { name: "Vinduespolering", add: 149, sub: "+149 kr.", icon: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" /> },
  { name: "Gulvbehandling", add: 199, sub: "+199 kr.", icon: <path d="M3 9h18M3 15h18M9 3v18M15 3v18" /> },
  { name: "Køkken / kantine", add: 99, sub: "+99 kr.", icon: <path d="M3 2v7c0 1 1 2 2 2s2-1 2-2V2M5 11v11M15 2c-1.5 0-3 2-3 5s1.5 4 3 4v11" /> },
  { name: "Hygiejnedokumentation", add: 79, sub: "+79 kr.", icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M9 14l2 2 4-4" /></> },
];

const INCLUDED_PRIVAT = [
  {
    title: "Gulve & støv",
    items: ["Støvsugning af alle gulve", "Gulvvask af alle gulve", "Fjernelse af spindelvæv"],
    icon: <path d="M3 13h18M3 17h18M5 13v6M19 13v6M7 5l5-3 5 3v8H7z" />,
  },
  {
    title: "Overflader & aftørring",
    items: ["Aftørring af alle vandrette flader", "Kontaktflader (kontakter, håndtag)", "Vinduskarme og fodlister"],
    icon: <path d="M3 7h18M3 12h18M3 17h18" />,
  },
  {
    title: "Bad & køkken",
    items: ["Rengøring af badeværelse", "Toilet, vask og spejle", "Køkken-overflader og vask"],
    icon: <><path d="M5 4h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3z" /><path d="M8 16v4M14 16v4" /></>,
  },
];

const INCLUDED_ERHVERV = [
  {
    title: "Gulve & støv",
    items: ["Støvsugning af alle gulve", "Mopning og gulvvask", "Fjernelse af spindelvæv"],
    icon: <path d="M3 13h18M3 17h18M5 13v6M19 13v6M7 5l5-3 5 3v8H7z" />,
  },
  {
    title: "Overflader & kontaktflader",
    items: ["Aftørring af skriveborde", "Mødelokaler og fællesarealer", "Dørhåndtag, kontakter, gelænder"],
    icon: <path d="M3 7h18M3 12h18M3 17h18" />,
  },
  {
    title: "Køkken & sanitet",
    items: ["Køkken, kaffeområde og kantine", "Toiletter og vådrum", "Affald sorteret og tømt"],
    icon: <><path d="M5 4h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3z" /><path d="M8 16v4M14 16v4" /></>,
  },
];

const FAQS_BASE = [
  { q: "Hvad er inkluderet i prisen?", a: "Alle priser inkluderer rengøringsmidler, udstyr, fast team og kvalitetstjek. Vi medbringer alt — du skal blot give os adgang.", open: true },
  { q: "Er beregneren bindende?", a: "Nej. Beregneren giver et vejledende estimat. Den endelige pris fastsættes efter et gratis tilbud, hvor vi ser lokalerne." },
  { q: "Hvor hurtigt kan I starte?", a: "Vi kan i de fleste tilfælde være i gang inden for en uge. Akutte opgaver løser vi ofte hurtigere — ring og hør nærmere." },
  { q: "Kan jeg ændre eller opsige aftalen?", a: "Ja. Faste aftaler kan opsiges med en måneds varsel, og enkelte besøg kan ændres op til 48 timer før uden beregning." },
  { q: "Bruger I miljøvenlige produkter?", a: "Altid. Vi benytter svanemærkede, godkendte midler, der er skånsomme over for mennesker, dyr og natur." },
];

const BASE = 199;

function kr(n: number, round: number) {
  const rounded = Math.round(n / round) * round;
  return rounded.toLocaleString("da-DK") + " kr.";
}

function m2note(v: number) {
  if (v < 80) return "≈ lille lejlighed / kontor";
  if (v < 200) return "≈ hus / mellemstort kontor";
  if (v < 500) return "≈ stort hus / etage / butik";
  if (v < 1000) return "≈ flere etager";
  return "≈ stort erhvervsareal";
}

const WIZ_STEPS = [
  { label: "Hvem" },
  { label: "Type" },
  { label: "Areal" },
  { label: "Frekvens" },
  { label: "Inkluderet" },
  { label: "Pris" },
  { label: "Tilbud" },
] as const;

function findTypeIdx(types: PropertyType[], wantedName?: string) {
  if (!wantedName) return 0;
  const i = types.findIndex((t) => t.name === wantedName);
  return i >= 0 ? i : 0;
}

function Prisberegner() {
  const [searchParams] = useSearchParams();

  const urlAudience: WizAudience = searchParams.get("for") === "erhverv" ? "erhverv" : "privat";
  const urlServiceSlug = searchParams.get("service") || "";
  const urlService = urlServiceSlug ? SERVICES_BY_SLUG[urlServiceSlug] : undefined;

  const initialAudience: WizAudience = urlService
    ? urlService.audience === "erhverv" ? "erhverv" : urlService.audience === "privat" ? "privat" : urlAudience
    : urlAudience;

  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<WizAudience>(initialAudience);
  const [typeIdx, setTypeIdx] = useState(() => {
    const types = initialAudience === "privat" ? TYPES_PRIVAT : TYPES_ERHVERV;
    return findTypeIdx(types, urlService?.wizardType);
  });
  const [m2, setM2] = useState(initialAudience === "privat" ? 80 : 150);
  const [freqIdx, setFreqIdx] = useState(2);
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());
  const [serviceSlug, setServiceSlug] = useState<string>(urlServiceSlug);

  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  type CvrStatus = "idle" | "loading" | "ok" | "notfound" | "error";
  const [cvrStatus, setCvrStatus] = useState<CvrStatus>("idle");
  const [cvrCompany, setCvrCompany] = useState("");
  const lastCvrLookup = useRef("");
  const [formValues, setFormValues] = useState({
    navn: "",
    virksomhed: "",
    kontaktperson: "",
    cvr: "",
    adresse: "",
    tlf: "",
    email: "",
    kommentar: "",
  });

  useEffect(() => {
    const types = audience === "privat" ? TYPES_PRIVAT : TYPES_ERHVERV;
    if (typeIdx >= types.length) setTypeIdx(0);
    setSelectedAddons(new Set());
    setM2((cur) => {
      const fallback = audience === "privat" ? 80 : 150;
      return cur && cur > 0 ? cur : fallback;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audience]);

  const types = audience === "privat" ? TYPES_PRIVAT : TYPES_ERHVERV;
  const addons = audience === "privat" ? ADDONS_PRIVAT : ADDONS_ERHVERV;
  const included = audience === "privat" ? INCLUDED_PRIVAT : INCLUDED_ERHVERV;
  const type = types[typeIdx] ?? types[0];
  const freq = FREQS[freqIdx];

  const momsLabel = audience === "privat" ? "inkl. moms" : "ekskl. moms";
  const momsMul = audience === "privat" ? 1.25 : 1;

  const perVisitBase = useMemo(() => {
    const fixedAdd = Array.from(selectedAddons).reduce((sum, i) => sum + (addons[i]?.add ?? 0), 0);
    const pctAddon = Array.from(selectedAddons).map((i) => addons[i]).find((a) => a?.pct !== undefined);
    let v = (BASE + m2 * type.rate) * freq.mult + fixedAdd;
    if (pctAddon?.pct) v *= 1 + pctAddon.pct;
    return v;
  }, [m2, type.rate, freq.mult, selectedAddons, addons]);

  const perVisit = perVisitBase * momsMul;

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
    setSubmitted(false);
    setFormValues({ navn: "", virksomhed: "", kontaktperson: "", cvr: "", adresse: "", tlf: "", email: "", kommentar: "" });
    setCvrStatus("idle");
    setCvrCompany("");
    lastCvrLookup.current = "";
  };

  // Look up Danish company details from a CVR number via the server-side proxy
  // and prefill the form (without overwriting anything the user already typed).
  const lookupCvr = async (raw: string) => {
    const cvr = raw.replace(/\D/g, "");
    if (cvr.length !== 8 || lastCvrLookup.current === cvr) return;
    lastCvrLookup.current = cvr;
    setCvrStatus("loading");
    try {
      const res = await fetch(`/api/cvr?cvr=${cvr}`);
      const data = await res.json();
      if (!res.ok || !data.found) {
        setCvrStatus("notfound");
        return;
      }
      const fullAddress = [data.address, [data.zipcode, data.city].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", ");
      setCvrCompany(data.name || "");
      setFormValues((v) => ({
        ...v,
        virksomhed: data.name || v.virksomhed,
        adresse: fullAddress || v.adresse,
        tlf: v.tlf || data.phone || "",
        email: v.email || data.email || "",
      }));
      setFormErrors((p) => ({ ...p, virksomhed: false, adresse: false }));
      setCvrStatus("ok");
    } catch {
      setCvrStatus("error");
    }
  };

  const onCvrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormValues((v) => ({ ...v, cvr: val }));
    const digits = val.replace(/\D/g, "");
    if (digits.length === 8) {
      lookupCvr(digits);
    } else {
      setCvrStatus("idle");
      setCvrCompany("");
      lastCvrLookup.current = "";
    }
  };

  const update = (k: keyof typeof formValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((v) => ({ ...v, [k]: e.target.value }));
    setFormErrors((p) => ({ ...p, [k]: false }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formValues.email.trim());
    if (audience === "privat") {
      if (!formValues.navn.trim()) errs.navn = true;
    } else {
      if (!formValues.virksomhed.trim()) errs.virksomhed = true;
      if (!formValues.kontaktperson.trim()) errs.kontaktperson = true;
    }
    if (!formValues.adresse.trim()) errs.adresse = true;
    if (formValues.tlf.trim().length < 6) errs.tlf = true;
    if (!emailOk) errs.email = true;
    setFormErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const serviceLabel = serviceSlug && SERVICES_BY_SLUG[serviceSlug]
    ? SERVICES_BY_SLUG[serviceSlug].title
    : type.name;

  if (submitted) {
    return (
      <div className="calc reveal">
        <div className="wiz-body" style={{ textAlign: "center", padding: "clamp(40px, 6vw, 80px)" }}>
          <div style={{ width: 78, height: 78, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center", margin: "0 auto 22px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 38, height: 38 }}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="wiz-title">Tak for din henvendelse!</h3>
          <p style={{ color: "var(--text-dim)", maxWidth: 480, margin: "12px auto 0" }}>
            Vi har modtaget din forespørgsel og vender tilbage inden for 24 timer.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <Link to="/" className="btn btn-primary">Tilbage til forsiden</Link>
            <Link to="/tjenester" className="btn btn-ghost">Se vores ydelser</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calc reveal">
      <div className="wiz-head">
        <div className="wiz-steps" aria-label="Trin">
          {WIZ_STEPS.map((s, i) => (
            <div key={s.label} className={`wiz-step${i === step ? " active" : ""}${i < step ? " done" : ""}`}>
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
            <p className="wiz-sub">Vi tilpasser priser, pakker og tilbud efter, om det er til hjemmet eller virksomheden.</p>
            <div className="aud-grid">
              <button type="button" className={`aud-card${audience === "privat" ? " sel" : ""}`} onClick={() => setAudience("privat")} aria-pressed={audience === "privat"}>
                <span className="aud-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                    <path d="M9 21v-6h6v6" />
                  </svg>
                </span>
                <b>Privat</b>
                <span>Hjem, lejlighed, sommerhus · priser inkl. moms</span>
              </button>
              <button type="button" className={`aud-card${audience === "erhverv" ? " sel" : ""}`} onClick={() => setAudience("erhverv")} aria-pressed={audience === "erhverv"}>
                <span className="aud-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                </span>
                <b>Erhverv</b>
                <span>Kontor, butik, klinik, ejendom · priser ekskl. moms</span>
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
                  onClick={() => {
                    setTypeIdx(i);
                    setServiceSlug("");
                  }}
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
            <p className="wiz-sub">Justér skyderen — vi viser en omtrentlig størrelseskategori.</p>
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
                <button key={f.name} type="button" className={i === freqIdx ? "sel" : ""} onClick={() => setFreqIdx(i)} aria-pressed={i === freqIdx}>
                  {f.name}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="wiz-title">Hvad er inkluderet</h3>
            <p className="wiz-sub">Følgende er altid en del af vores rengøring — du kan tilføje ekstra ydelser nedenfor.</p>
            <div className="included-grid">
              {included.map((box) => (
                <div key={box.title} className="included-card">
                  <div className="included-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {box.icon}
                    </svg>
                  </div>
                  <h4>{box.title}</h4>
                  <ul>
                    {box.items.map((it) => (
                      <li key={it}><span className="ck"><Check /></span>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <h4 style={{ marginTop: 32, marginBottom: 16 }}>Valgfri tilvalg (lægges til prisen)</h4>
            <div className="addons">
              {addons.map((a, i) => (
                <button key={a.name} type="button" className={`addon${selectedAddons.has(i) ? " sel" : ""}`} onClick={() => toggleAddon(i)} aria-pressed={selectedAddons.has(i)}>
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
          <aside className="calc-side" style={{ borderRadius: 16, marginInline: "-1px" }}>
            <p className="res-eyebrow">Estimeret pris · {audience === "privat" ? "Privat" : "Erhverv"}</p>
            <div className="res-price tnum">{kr(perVisit, 5)}</div>
            <p className="res-per">pr. besøg · {momsLabel}</p>

            <div className="res-break" style={{ marginTop: 30 }}>
              <div className="rb"><span>Type</span><span>{type.name}</span></div>
              <div className="rb"><span>Areal</span><span>{m2.toLocaleString("da-DK")} m²</span></div>
              <div className="rb"><span>Frekvens</span><span>{freq.name}</span></div>
              {selectedAddons.size > 0 && (
                <div className="rb"><span>Tilvalg</span><span>{selectedAddons.size} valgt — inkluderet i prisen</span></div>
              )}
            </div>

            <p className="res-note" style={{ marginTop: 24 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Alle tilvalg er allerede regnet med i prisen pr. besøg. Vejledende estimat — endelig pris fastsættes efter aftale.
            </p>
          </aside>
        )}

        {step === 6 && (
          <>
            <h3 className="wiz-title">Få et gratis tilbud</h3>
            <p className="wiz-sub">
              Udfyld formularen — så vender vi tilbage med et skræddersyet tilbud inden for 24 timer. Vi har noteret <strong>{serviceLabel}</strong>.
            </p>
            <form onSubmit={handleSubmit} noValidate className="wiz-form">
              {audience === "privat" ? (
                <div className="fgrid">
                  <div className={`field${formErrors.navn ? " invalid" : ""}`}>
                    <label htmlFor="navn">Navn <span className="req">*</span></label>
                    <input id="navn" type="text" autoComplete="name" value={formValues.navn} onChange={update("navn")} className={formErrors.navn ? "err" : ""} />
                    <span className="msg">Skriv venligst dit navn.</span>
                  </div>
                  <div className={`field${formErrors.adresse ? " invalid" : ""}`}>
                    <label htmlFor="adresse">Adresse <span className="req">*</span></label>
                    <input id="adresse" type="text" autoComplete="street-address" value={formValues.adresse} onChange={update("adresse")} className={formErrors.adresse ? "err" : ""} />
                    <span className="msg">Skriv venligst en adresse.</span>
                  </div>
                  <div className={`field${formErrors.tlf ? " invalid" : ""}`}>
                    <label htmlFor="tlf">Telefon <span className="req">*</span></label>
                    <input id="tlf" type="tel" autoComplete="tel" value={formValues.tlf} onChange={update("tlf")} className={formErrors.tlf ? "err" : ""} />
                    <span className="msg">Skriv venligst et telefonnummer.</span>
                  </div>
                  <div className={`field${formErrors.email ? " invalid" : ""}`}>
                    <label htmlFor="email">E-mail <span className="req">*</span></label>
                    <input id="email" type="email" autoComplete="email" value={formValues.email} onChange={update("email")} className={formErrors.email ? "err" : ""} />
                    <span className="msg">Skriv venligst en gyldig e-mail.</span>
                  </div>
                  <div className="field full">
                    <label htmlFor="kommentar">Kommentar</label>
                    <textarea id="kommentar" value={formValues.kommentar} onChange={update("kommentar")} placeholder="Særlige ønsker eller spørgsmål..." />
                    <span className="msg">&nbsp;</span>
                  </div>
                </div>
              ) : (
                <div className="fgrid">
                  <div className={`field${formErrors.virksomhed ? " invalid" : ""}`}>
                    <label htmlFor="virksomhed">Virksomhedsnavn <span className="req">*</span></label>
                    <input id="virksomhed" type="text" autoComplete="organization" value={formValues.virksomhed} onChange={update("virksomhed")} className={formErrors.virksomhed ? "err" : ""} />
                    <span className="msg">Skriv venligst et virksomhedsnavn.</span>
                  </div>
                  <div className={`field${formErrors.kontaktperson ? " invalid" : ""}`}>
                    <label htmlFor="kontaktperson">Kontaktperson <span className="req">*</span></label>
                    <input id="kontaktperson" type="text" autoComplete="name" value={formValues.kontaktperson} onChange={update("kontaktperson")} className={formErrors.kontaktperson ? "err" : ""} />
                    <span className="msg">Skriv venligst kontaktperson.</span>
                  </div>
                  <div className="field">
                    <label htmlFor="cvr">
                      CVR <span style={{ color: "var(--text-mute)", fontWeight: 400 }}>(valgfrit — henter firmadata)</span>
                    </label>
                    <div className="cvr-wrap">
                      <input
                        id="cvr"
                        type="text"
                        inputMode="numeric"
                        maxLength={11}
                        autoComplete="off"
                        placeholder="8 cifre"
                        value={formValues.cvr}
                        onChange={onCvrChange}
                        onBlur={() => lookupCvr(formValues.cvr)}
                      />
                      {cvrStatus === "loading" && <span className="cvr-spin" aria-hidden="true" />}
                    </div>
                    <span className="cvr-status" aria-live="polite" data-state={cvrStatus}>
                      {cvrStatus === "loading" && "Henter virksomhedsdata…"}
                      {cvrStatus === "ok" && `✓ ${cvrCompany || "Virksomhed fundet"} — felter udfyldt`}
                      {cvrStatus === "notfound" && "Intet match — udfyld felterne manuelt."}
                      {cvrStatus === "error" && "Kunne ikke hente data lige nu — udfyld manuelt."}
                      {cvrStatus === "idle" && " "}
                    </span>
                  </div>
                  <div className={`field${formErrors.adresse ? " invalid" : ""}`}>
                    <label htmlFor="adresse">Adresse <span className="req">*</span></label>
                    <input id="adresse" type="text" autoComplete="street-address" value={formValues.adresse} onChange={update("adresse")} className={formErrors.adresse ? "err" : ""} />
                    <span className="msg">Skriv venligst en adresse.</span>
                  </div>
                  <div className={`field${formErrors.tlf ? " invalid" : ""}`}>
                    <label htmlFor="tlf">Telefon <span className="req">*</span></label>
                    <input id="tlf" type="tel" autoComplete="tel" value={formValues.tlf} onChange={update("tlf")} className={formErrors.tlf ? "err" : ""} />
                    <span className="msg">Skriv venligst et telefonnummer.</span>
                  </div>
                  <div className={`field${formErrors.email ? " invalid" : ""}`}>
                    <label htmlFor="email">E-mail <span className="req">*</span></label>
                    <input id="email" type="email" autoComplete="email" value={formValues.email} onChange={update("email")} className={formErrors.email ? "err" : ""} />
                    <span className="msg">Skriv venligst en gyldig e-mail.</span>
                  </div>
                  <div className="field full">
                    <label htmlFor="kommentar">Kommentar</label>
                    <textarea id="kommentar" value={formValues.kommentar} onChange={update("kommentar")} placeholder="Særlige ønsker eller spørgsmål..." />
                    <span className="msg">&nbsp;</span>
                  </div>
                </div>
              )}
              <input type="hidden" name="ydelse" value={serviceLabel} />
              <input type="hidden" name="estimat" value={kr(perVisit, 5)} />
              <input type="hidden" name="audience" value={audience} />
              {audience === "erhverv" && <input type="hidden" name="cvr" value={formValues.cvr.replace(/\D/g, "")} />}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
                <span style={{ fontSize: "var(--fs-meta)", color: "var(--text-mute)" }}>
                  Valgt ydelse: <strong style={{ color: "var(--ink)" }}>{serviceLabel}</strong> · estimeret pris <strong style={{ color: "var(--ink)" }}>{kr(perVisit, 5)}</strong>
                </span>
                <button type="submit" className="btn btn-primary btn-lg">Send forespørgsel <Arrow /></button>
              </div>
            </form>
          </>
        )}
      </div>

      <div className="wiz-nav">
        {step > 0 && step < 6 ? (
          <button type="button" className="btn btn-ghost" onClick={goBack}>← Tilbage</button>
        ) : step === 6 ? (
          <button type="button" className="btn btn-ghost" onClick={goBack}>← Justér beregning</button>
        ) : <span />}
        <span className="spacer" />
        {step < 5 ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>Næste <Arrow /></button>
        ) : step === 5 ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>Få et gratis tilbud <Arrow /></button>
        ) : step === 6 ? null : (
          <button type="button" className="btn btn-ghost" onClick={goReset}>Start forfra</button>
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
              Ingen skjulte gebyrer, ingen overraskelser. Vi viser priser inkl. moms for private kunder og
              ekskl. moms for erhverv — vælg selv i første trin.
            </p>
          </div>
        </header>

        <section className="wrap" id="beregner" style={{ paddingBottom: "var(--pad-section)", scrollMarginTop: 120 }}>
          <Prisberegner />
        </section>

        <section className="blk wrap" style={{ paddingTop: 0 }}>
          <div className="shead center reveal">
            <p className="eyebrow">Spørgsmål & svar</p>
            <h2>Ofte stillede spørgsmål</h2>
          </div>
          <div className="faq reveal d1">
            {FAQS_BASE.map((f) => (
              <details className="qa" key={f.q} open={f.open}>
                <summary>{f.q}<span className="pl" /></summary>
                <div className="qa-body">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="blk wrap" style={{ paddingTop: 0 }}>
          <div className="ctaband reveal">
            <h2>Klar til at komme i gang?</h2>
            <p>Få et gratis og uforpligtende tilbud inden for 24 timer — skræddersyet til netop dine behov.</p>
            <div className="row">
              <Link className="btn btn-white btn-lg" to="/kontakt">Få et gratis tilbud</Link>
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
