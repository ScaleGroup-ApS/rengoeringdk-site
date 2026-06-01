import type { Route } from "./+types/tjenester";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { ImageFrame } from "~/components/ImageFrame";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { PHOTOS } from "~/lib/photos";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/tjenester`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Tjenester — Define Cleaning Services ApS",
      description:
        "Alt inden for professionel erhvervsrengøring: kontor, vinduespolering, klinik, trappevask, flytte- og industrirengøring. Fast team, dokumenteret kvalitet efter INSTA 800.",
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
  name: "Tjenester – Define Cleaning Services ApS",
  description: "Professionel erhvervsrengøring i hele Danmark.",
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

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type Service = {
  id: string;
  num: string;
  title: string;
  desc: string;
  tag: string;
  tagIcon: React.ReactNode;
  features: string[];
  flip?: boolean;
  photo: string;
};

const SERVICES: Service[] = [
  {
    id: "kontor",
    num: "01 — KONTOR",
    title: "Kontorrengøring",
    desc: "Daglig eller ugentlig rengøring uden for arbejdstid, så medarbejderne altid møder ind til et friskt, repræsentativt kontor. Fast team, der lærer jeres lokaler at kende.",
    tag: "Mest efterspurgt",
    tagIcon: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />,
    features: ["Skriveborde & kontaktflader", "Køkken & kantine", "Toiletter & vådrum", "Gulve, støvsugning & mopning"],
    photo: PHOTOS.svcKontor,
  },
  {
    id: "vinduer",
    num: "02 — GLAS",
    title: "Vinduespolering",
    desc: "Klare facader, butiksruder og glaspartier — indvendigt og udvendigt, også i højde. Faste intervaller eller efter behov, så jeres indtryk altid er skarpt.",
    tag: "Streg- & pletfri",
    tagIcon: <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10" />,
    features: ["Facader & butiksruder", "Rammer & karme", "Højde & svær adgang", "Faste intervaller"],
    flip: true,
    photo: PHOTOS.svcVinduer,
  },
  {
    id: "klinik",
    num: "03 — SUNDHED",
    title: "Klinik & hygiejnerengøring",
    desc: "Dokumenteret hygiejnerengøring til klinikker, tandlæger, institutioner og laboratorier med skærpede krav. Tydelige procedurer og fuld sporbarhed på hvert besøg.",
    tag: "Hygiejnesikret",
    tagIcon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
    features: ["Afspritning af kontaktflader", "Behandlings- & venterum", "Farvekodet udstyr", "Dokumentation pr. besøg"],
    photo: PHOTOS.svcKlinik,
  },
  {
    id: "trappe",
    num: "04 — EJENDOM",
    title: "Trappevask & ejendomsservice",
    desc: "Faste aftaler for ejendomme, boligforeninger og erhvervslejemål. Rene trapper, elevatorer og fællesarealer — år efter år, med samme faste kontaktperson.",
    tag: "Faste aftaler",
    tagIcon: <path d="M3 9h18M9 21V9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    features: ["Trapper & reposer", "Elevatorer & entré", "Fællesarealer", "Vinduer i opgange"],
    flip: true,
    photo: PHOTOS.svcTrappe,
  },
  {
    id: "flytte",
    num: "05 — FLYTNING",
    title: "Flytte- & byggerengøring",
    desc: "Grundig fraflytnings- og byggerengøring til erhvervslejemål. Afleveret efter aftale og klar til syn — så I står stærkt ved overdragelsen.",
    tag: "Klar til syn",
    tagIcon: <path d="M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2z" />,
    features: ["Dybderengøring af alt", "Byggestøv & pletter", "Hvidevarer indvendigt", "Vinduer, karme & gulve"],
    photo: PHOTOS.svcFlytte,
  },
  {
    id: "industri",
    num: "06 — INDUSTRI",
    title: "Industri & lager",
    desc: "Specialrengøring af produktion, lager og haller med professionelt udstyr og fokus på sikkerhed. Vi tilpasser os jeres drift og åbningstider.",
    tag: "Tungt udstyr",
    tagIcon: <path d="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    features: ["Produktions- & lagerhaller", "Gulvbehandling", "Højtryksrensning", "Sikkerheds- & hygiejnekrav"],
    flip: true,
    photo: PHOTOS.svcIndustri,
  },
];

const STEPS = [
  { n: "TRIN 01", title: "Uforpligtende besøg", desc: "Vi ser lokalerne og lytter til jeres behov og ønsker." },
  { n: "TRIN 02", title: "Skræddersyet tilbud", desc: "Fast, gennemsigtig pris inden for 24 timer." },
  { n: "TRIN 03", title: "Opstart med fast team", desc: "Samme medarbejdere hver gang — oplært i jeres lokaler." },
  { n: "TRIN 04", title: "Løbende kvalitetstjek", desc: "Vi dokumenterer og følger op, så standarden holder." },
];

export default function Tjenester(_: Route.ComponentProps) {
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
              <b>Tjenester</b>
            </nav>
            <p className="eyebrow reveal">Vores ydelser</p>
            <h1 className="reveal d1">Alt inden for professionel erhvervsrengøring</h1>
            <p className="lead reveal d2">
              Fra det daglige kontor til specialopgaver med skærpede hygiejnekrav. Vi sammensætter
              en fast aftale, der passer til jeres bygning, branche og budget — leveret af et fast,
              oplært team.
            </p>
            <div className="introstrip">
              <div className="introstat reveal d2"><div className="v tnum">6 brancher</div><div className="l">Specialiseret erfaring</div></div>
              <div className="introstat reveal d3"><div className="v tnum">24 timer</div><div className="l">Svar på dit tilbud</div></div>
              <div className="introstat reveal d4"><div className="v">INSTA 800</div><div className="l">Dokumenteret kvalitet</div></div>
            </div>
          </div>
        </header>

        <section className="wrap" style={{ paddingBottom: "var(--pad-section)" }}>
          {SERVICES.map((svc) => (
            <article key={svc.id} className={`svcrow${svc.flip ? " flip" : ""}`} id={svc.id}>
              <div className="media reveal">
                <ImageFrame src={svc.photo} alt={svc.title} />
                <span className="tag-float">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {svc.tagIcon}
                  </svg>
                  {svc.tag}
                </span>
              </div>
              <div className="reveal d1">
                <span className="svc-num">{svc.num}</span>
                <h2>{svc.title}</h2>
                <p className="desc">{svc.desc}</p>
                <ul className="feat">
                  {svc.features.map((f) => (
                    <li key={f}><span className="ck"><Check /></span>{f}</li>
                  ))}
                </ul>
                <div className="acts">
                  <Link className="btn btn-primary" to="/priser#beregner">Beregn pris</Link>
                  <Link className="btn btn-ghost" to="/kontakt">Få et tilbud</Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="blk wrap" style={{ borderTop: "1px solid var(--hairline)" }}>
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
