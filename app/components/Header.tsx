import { Link } from "react-router";
import { useState } from "react";

interface HeaderProps {
  siteName?: string;
  menuItems?: Array<{
    title: string;
    url: string;
    children?: Array<{ title: string; url: string }>;
  }>;
}

export function Header({ siteName = "Site", menuItems = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Site Title */}
        <Link
          to="/"
          className="text-xl font-bold text-secondary tracking-tight hover:text-primary transition-colors"
        >
          {siteName}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <NavLink key={item.url} href={item.url} label={item.title} />
          ))}
          {menuItems.length === 0 && (
            <>
              <NavLink href="/" label="Forside" />
              <NavLink href="/om-os" label="Om os" />
              <NavLink href="/kontakt" label="Kontakt" />
            </>
          )}
        </nav>

        {/* CTA Button (desktop) */}
        <div className="hidden md:block">
          <Link
            to="/kontakt"
            className="inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95"
          >
            Kontakt os
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-surface-dim transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-border/50 animate-fade-in-up">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            {menuItems.length > 0
              ? menuItems.map((item) => (
                  <MobileNavLink
                    key={item.url}
                    href={item.url}
                    label={item.title}
                    onClick={() => setMobileOpen(false)}
                  />
                ))
              : (
                <>
                  <MobileNavLink href="/" label="Forside" onClick={() => setMobileOpen(false)} />
                  <MobileNavLink href="/om-os" label="Om os" onClick={() => setMobileOpen(false)} />
                  <MobileNavLink href="/kontakt" label="Kontakt" onClick={() => setMobileOpen(false)} />
                </>
              )}
            <div className="pt-2">
              <Link
                to="/kontakt"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Kontakt os
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  // Convert absolute WordPress URLs to relative paths
  const to = href.startsWith("http") ? new URL(href).pathname : href;

  return (
    <Link
      to={to}
      className="text-sm font-medium text-text-muted hover:text-text transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  const to = href.startsWith("http") ? new URL(href).pathname : href;

  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 text-text hover:bg-surface-dim rounded-xl transition-colors font-medium"
    >
      {label}
    </Link>
  );
}
