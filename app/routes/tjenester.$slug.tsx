import type { Route } from "./+types/tjenester.$slug";
import { Link, isRouteErrorResponse } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { ImageFrame } from "~/components/ImageFrame";
import { JsonLd } from "~/components/JsonLd";
import { useSiteEffects } from "~/hooks/useSiteEffects";
import { PHOTOS } from "~/lib/photos";
import { SERVICES_BY_SLUG, type Service } from "~/lib/services";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";

export function loader({ params }: Route.LoaderArgs) {
  const service = SERVICES_BY_SLUG[params.slug];
  if (!service) {
    throw new Response("Service ikke fundet", { status: 404 });
  }
  return { service };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "Ikke fundet — Define Cleaning Services ApS" },
      { name: "robots", content: "noindex" },
    ];
  }
  const url = `${SITE_URL}/tjenester/${data.service.slug}`;
  return [
    ...buildMeta({
      title: data.service.metaTitle,
      description: data.service.metaDesc,
      url,
      siteName: "Define Cleaning Services ApS",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: url },
  ];
}

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

function priceForAudience(svc: Service, audience: "privat" | "erhverv") {
  if (audience === "privat") {
    const v = Math.round((svc.fromPrice * 1.25) / 5) * 5;
    return `Fra ${v.toLocaleString("da-DK")} kr. pr. besøg (inkl. moms)`;
  }
  return `Fra ${svc.fromPrice.toLocaleString("da-DK")} kr. pr. besøg (ekskl. moms)`;
}

function pickerAudience(svc: Service): "privat" | "erhverv" {
  if (svc.audience === "privat") return "privat";
  return "erhverv";
}

export default function ServiceDetail({ loaderData }: Route.ComponentProps) {
  useSiteEffects();
  const svc = loaderData.service;
  const audience = pickerAudience(svc);
  const beregnerHref = `/priser?for=${audience}&service=${svc.slug}#beregner`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    description: svc.metaDesc,
    provider: {
      "@type": "Organization",
      name: "Define Cleaning Services ApS",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Danmark",
    },
    url: `${SITE_URL}/tjenester/${svc.slug}`,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: svc.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="page">
      <Header />
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />

      <main>
        <header className="phero">
          <div className="wrap">
            <nav className="crumb reveal" aria-label="Brødkrumme">
              <Link to="/">Forside</Link>
              <span className="sep">/</span>
              <Link to="/tjenester">Tjenester</Link>
              <span className="sep">/</span>
              <b>{svc.title}</b>
            </nav>
            <p className="eyebrow reveal">
              {svc.audience === "privat" ? "Privat" : svc.audience === "erhverv" ? "Erhverv" : "Privat & Erhverv"}
            </p>
            <h1 className="reveal d1">{svc.title}</h1>
            <p className="lead reveal d2">{svc.heroLead}</p>
            <div className="hero-cta reveal d3" style={{ marginTop: 28 }}>
              <Link className="btn btn-primary" to={beregnerHref}>
                Beregn pris <Arrow />
              </Link>
              <Link className="btn btn-ghost" to={`/kontakt?service=${svc.slug}`}>
                Få et gratis tilbud
              </Link>
            </div>
          </div>
        </header>

        <section className="wrap" style={{ paddingBottom: "var(--pad-section)" }}>
          <div className="svc-detail-grid">
            <div className="svc-detail-media">
              <ImageFrame src={PHOTOS[svc.photo]} alt={svc.title} className="svc-detail-img" />
              <div className="svc-price-card">
                <span className="svc-price-label">Vejledende pris</span>
                <strong>{priceForAudience(svc, audience)}</strong>
                <Link to={beregnerHref} className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>
                  Beregn præcis pris <Arrow />
                </Link>
              </div>
            </div>

            <div className="svc-detail-body">
              <h2>Det er inkluderet</h2>
              <ul className="feat">
                {svc.features.map((f) => (
                  <li key={f}><span className="ck"><Check /></span>{f}</li>
                ))}
              </ul>

              {svc.sections.map((sec) => (
                <div key={sec.heading} className="svc-section">
                  <h2>{sec.heading}</h2>
                  <p>{sec.body}</p>
                </div>
              ))}

              <div className="svc-section">
                <h2>Hvorfor vælge Define til {svc.shortTitle.toLowerCase()}?</h2>
                <ul className="feat">
                  {svc.whyUs.map((w) => (
                    <li key={w}><span className="ck"><Check /></span>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="svc-section">
                <h2>Ofte stillede spørgsmål om {svc.shortTitle.toLowerCase()}</h2>
                <div className="faq" style={{ maxWidth: "none", marginInline: 0 }}>
                  {svc.faqs.map((f, i) => (
                    <details className="qa" key={f.q} open={i === 0}>
                      <summary>{f.q}<span className="pl" /></summary>
                      <div className="qa-body">{f.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {svc.related.length > 0 && (
          <section className="blk" style={{ background: "var(--bg-sunken)", paddingBlock: "var(--pad-section)" }}>
            <div className="wrap">
              <div className="shead center reveal">
                <p className="eyebrow">Relateret</p>
                <h2>Andre ydelser, der kan interessere dig</h2>
              </div>
              <div className="svc-grid">
                {svc.related.map((slug) => {
                  const r = SERVICES_BY_SLUG[slug];
                  if (!r) return null;
                  return (
                    <Link key={slug} to={`/tjenester/${r.slug}`} className="svc">
                      <div className="svc-ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={r.iconPath} />
                        </svg>
                      </div>
                      <h3>{r.title}</h3>
                      <p>{r.shortDesc}</p>
                      <span className="more">Læs mere <Arrow /></span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="blk wrap">
          <div className="ctaband reveal">
            <h2>{audience === "privat" ? "Klar til et renere hjem?" : "Klar til et renere arbejdsmiljø?"}</h2>
            <p>Få et gratis, uforpligtende tilbud inden for 24 timer — skræddersyet til dine behov.</p>
            <div className="row">
              <Link className="btn btn-white btn-lg" to={beregnerHref}>Beregn din pris <Arrow /></Link>
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="page">
      <Header />
      <main>
        <section className="wrap" style={{ paddingBlock: "10vh", textAlign: "center" }}>
          <h1>{is404 ? "Ydelsen findes ikke" : "Noget gik galt"}</h1>
          <p style={{ marginTop: 16, color: "var(--text-dim)" }}>
            {is404
              ? "Den ydelse, du leder efter, findes ikke. Se hele vores udvalg her."
              : "Vi kunne ikke vise denne side. Prøv igen, eller gå tilbage til ydelser."}
          </p>
          <Link className="btn btn-primary" to="/tjenester" style={{ marginTop: 24 }}>Se alle ydelser</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
