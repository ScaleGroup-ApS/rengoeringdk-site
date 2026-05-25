import { Link } from "react-router";

interface FooterProps {
  siteName?: string;
  siteDescription?: string;
}

export function Footer({ siteName = "Site", siteDescription }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-text-on-dark">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight">
              {siteName}
            </Link>
            {siteDescription && (
              <p className="mt-4 text-text-on-dark/70 max-w-md leading-relaxed">
                {siteDescription}
              </p>
            )}
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/" label="Forside" />
              <FooterLink to="/om-os" label="Om os" />
              <FooterLink to="/kontakt" label="Kontakt" />
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Juridisk
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/privatlivspolitik" label="Privatlivspolitik" />
              <FooterLink to="/handelsbetingelser" label="Handelsbetingelser" />
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-on-dark/50">
            © {year} {siteName}. Alle rettigheder forbeholdes.
          </p>
          <p className="text-xs text-text-on-dark/30">
            Drevet af{" "}
            <a
              href="https://scaleweb.dk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-on-dark/50 hover:text-text-on-dark/70 transition-colors"
            >
              Scaleweb
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link
        to={to}
        className="text-text-on-dark/60 hover:text-white transition-colors text-sm"
      >
        {label}
      </Link>
    </li>
  );
}
