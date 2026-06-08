import { Link } from "react-router";
import { SERVICES } from "~/lib/services";

const PRIVAT_SLUGS = [
  "hovedrengoering",
  "flytterengoering",
  "vinduespudsning",
  "haandvaerkerrengoering",
  "trappevask",
];

const ERHVERV_SLUGS = [
  "kontorrengoering",
  "butiksrengoering",
  "klinikrengoering",
  "industrirengoering",
  "skurvognsrengoering",
  "ejendomsservice",
  "institutionsrengoering",
  "restaurantrengoering",
  "hotelrengoering",
  "lager-og-logistikrengoering",
  "produktionsrengoering",
  "faellesarealer",
  "toilet-og-sanitetsrengoering",
];

export function Footer() {
  const year = new Date().getFullYear();
  const linkFor = (slug: string) => {
    const svc = SERVICES.find((s) => s.slug === slug);
    return svc ? <Link key={slug} to={`/tjenester/${svc.slug}`}>{svc.title}</Link> : null;
  };

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link className="logo" to="/" aria-label="Define Cleaning Services — Forside">
              <img src="/logo.png" alt="Define Cleaning Services" className="logo-img" width={482} height={262} />
            </Link>
            <p>
              Professionel rengøring i hele Danmark — til private hjem og virksomheder.
              Fast team, svanemærkede produkter og 20 års erfaring.
            </p>
            <div className="foot-contact">
              <a href="tel:+4571151606" className="foot-bigcontact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+45 71 15 16 06</span>
              </a>
              <a href="mailto:info@define-cleaning.dk" className="foot-bigcontact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <span>info@define-cleaning.dk</span>
              </a>
            </div>
            <Link to="/kontakt" className="btn btn-primary" style={{ marginTop: 20 }}>
              Få et gratis tilbud
            </Link>
          </div>

          <div className="foot-cols">
            <div className="fcol">
              <h5>Genveje</h5>
              <Link to="/privat">Privat</Link>
              <Link to="/erhverv">Erhverv</Link>
              <Link to="/tjenester">Alle ydelser</Link>
              <Link to="/priser">Priser & beregner</Link>
              <Link to="/om-os">Om os</Link>
              <Link to="/kontakt">Kontakt</Link>
            </div>

            <div className="fcol">
              <h5>Privat</h5>
              {PRIVAT_SLUGS.map(linkFor)}
            </div>

            <div className="fcol fcol-wide">
              <h5>Erhverv</h5>
              <div className="fcol-grid">
                {ERHVERV_SLUGS.map(linkFor)}
              </div>
            </div>
          </div>
        </div>

        <div className="foot-bot">
          <span>© {year} Define Cleaning Services ApS · CVR 40 68 10 86 · Alle rettigheder forbeholdes.</span>
          <span>Handelsbetingelser · Privatlivspolitik · Cookies</span>
        </div>
      </div>
    </footer>
  );
}
