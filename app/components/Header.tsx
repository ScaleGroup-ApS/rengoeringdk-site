import { Link, useLocation } from "react-router";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Forside", href: "/" },
  { label: "Om os", href: "/om-os" },
  { label: "Tjenester", href: "/tjenester" },
  { label: "Priser", href: "/priser" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Define waters A/S - Forside">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:bg-primary-dark transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="white" opacity="0.25"/>
              <path d="M6 15c2-3 4-4.5 6-4.5s4 1.5 6 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M4 18c2.5-4 5-6 8-6s5.5 2 8 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-secondary tracking-tight">
            Define <span className="text-primary">waters</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primær navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "text-primary bg-sky-50"
                  : "text-text-muted hover:text-text hover:bg-sky-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="mailto:info@define-waters.dk"
            className="text-sm text-text-muted hover:text-primary transition-colors hidden lg:block"
          >
            info@define-waters.dk
          </a>
          <Link
            to="/kontakt"
            className="inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95"
          >
            Få et tilbud
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-sky-50 transition-colors"
          aria-label={mobileOpen ? "Luk menu" : "Åbn menu"}
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-sky-100">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-1" aria-label="Mobil navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-sky-50"
                    : "text-text hover:bg-sky-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-sky-100">
              <Link
                to="/kontakt"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Få et tilbud
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
