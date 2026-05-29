import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Tjenester", href: "/tjenester" },
  { label: "Priser", href: "/priser" },
  { label: "Beregn pris", href: "/priser#beregner" },
  { label: "Om os", href: "/om-os" },
  { label: "Kontakt", href: "/kontakt" },
];

const PHONE = "+45 70 12 34 56";
const PHONE_HREF = "tel:+4570123456";
const EMAIL = "kontakt@rengoeringsfirma.dk";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (href: string) => {
    const path = href.split("#")[0];
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <>
      <div className="ubar">
        <div className="wrap">
          <span className="ubar-tp ubar-hide">
            <span className="stars" style={{ color: "var(--trustpilot)" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            Trustpilot · <b>4,9 / 5</b> · 512 anmeldelser
          </span>
          <div className="ubar-right">
            <a href={PHONE_HREF}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`} className="ubar-hide">{EMAIL}</a>
            <a className="ubar-hide">Hele Danmark · man–fre 7–18</a>
          </div>
        </div>
      </div>

      <nav className={`bar${scrolled ? " scrolled" : ""}`}>
        <div className="wrap">
          <Link className="logo" to="/" aria-label="Rengøringsfirma — Forside">
            <span className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 11l8-7 8 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </span>
            Rengøringsfirma
          </Link>

          <div className="navlinks">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={isActive(item.href) ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-cta">
            <a className="nav-phone" href={PHONE_HREF}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              70 12 34 56
            </a>
            <Link className="btn btn-primary" to="/priser#beregner">
              Beregn din pris
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <button
            className={`burger${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Luk menu" : "Åbn menu"}
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link
          className="btn btn-primary"
          style={{ marginTop: 18, justifyContent: "center" }}
          to="/priser#beregner"
          onClick={() => setMobileOpen(false)}
        >
          Beregn din pris
        </Link>
      </div>
    </>
  );
}
