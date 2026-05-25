import { Link } from "react-router";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-text-on-dark">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="white" opacity="0.25"/>
                  <path d="M6 15c2-3 4-4.5 6-4.5s4 1.5 6 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="M4 18c2.5-4 5-6 8-6s5.5 2 8 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Define <span className="text-primary-light">waters</span>
              </span>
            </Link>
            <p className="mt-4 text-text-on-dark/60 max-w-sm leading-relaxed text-sm">
              Professionel rengøring med omtanke. Vi leverer skræddersyede rengøringsløsninger til private og erhverv i hele Danmark.
            </p>
            <div className="mt-6 space-y-2 text-sm text-text-on-dark/60">
              <p>Boeslunde Byvej 76</p>
              <a href="mailto:info@define-waters.dk" className="block hover:text-white transition-colors">
                info@define-waters.dk
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/" label="Forside" />
              <FooterLink to="/om-os" label="Om os" />
              <FooterLink to="/tjenester" label="Tjenester" />
              <FooterLink to="/priser" label="Priser" />
              <FooterLink to="/kontakt" label="Kontakt" />
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-5">
              Tjenester
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/tjenester" label="Erhvervsrengøring" />
              <FooterLink to="/tjenester" label="Hjemmerengøring" />
              <FooterLink to="/tjenester" label="Vinduespolering" />
              <FooterLink to="/tjenester" label="Flytning/Aflevering" />
              <FooterLink to="/tjenester" label="Industri" />
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-on-dark/40">
            © {year} Define waters A/S. Alle rettigheder forbeholdes.
          </p>
          <p className="text-xs text-text-on-dark/30">
            Drevet af{" "}
            <a
              href="https://scaleweb.dk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-on-dark/50 transition-colors"
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
      <Link to={to} className="text-text-on-dark/60 hover:text-white transition-colors text-sm">
        {label}
      </Link>
    </li>
  );
}
