import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { ReactNode } from "react";
import type { Route } from "./+types/root";
import { JsonLd } from "~/components/JsonLd";
import { FloatingContact } from "~/components/FloatingContact";
import "./app.css";

const SITE_URL = "https://define-cleaning.dk";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Define Cleaning Services ApS",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  email: "info@define-cleaning.dk",
  telephone: "+4571151606",
  taxID: "DK40681086",
  vatID: "DK40681086",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Boeslunde Byvej 76",
    postalCode: "4242",
    addressLocality: "Boeslunde",
    addressCountry: "DK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@define-cleaning.dk",
    telephone: "+4571151606",
    contactType: "customer service",
    availableLanguage: "Danish",
  },
  sameAs: [],
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="da">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: `
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://scaleweb.matomo.cloud/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '54']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='https://cdn.matomo.cloud/scaleweb.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
  })();
        `}} />
      </head>
      <body className="min-h-screen bg-surface text-text antialiased">
        <JsonLd data={organizationSchema} />
        {children}
        <FloatingContact />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Der opstod en uventet fejl.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : `Fejl ${error.status}`;
    details =
      error.status === 404
        ? "Siden blev ikke fundet."
        : error.statusText || details;
  } else if (error instanceof Error) {
    if (import.meta.env.DEV) {
      details = error.message;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-dim">
      <div className="text-center max-w-md mx-auto px-6 py-16">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-3">{message}</h1>
          <p className="text-text-muted text-lg">{details}</p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary rounded-full font-semibold hover:bg-primary-light transition-colors"
        >
          ← Gå til forsiden
        </a>
      </div>
    </main>
  );
}
