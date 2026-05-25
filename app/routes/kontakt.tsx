import type { Route } from "./+types/kontakt";
import { Link } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { JsonLd } from "~/components/JsonLd";
import { buildMeta } from "~/lib/seo";

const SITE_URL = "https://rengoering.dk";
const PAGE_URL = `${SITE_URL}/kontakt`;

export function meta(_: Route.MetaArgs) {
  return [
    ...buildMeta({
      title: "Kontakt | Define waters A/S",
      description:
        "Kontakt Define waters A/S for et gratis og uforpligtende tilbud på rengøring. Vi svarer inden for 24 timer. Send os en besked eller skriv direkte til info@define-waters.dk.",
      url: PAGE_URL,
      siteName: "Define waters A/S",
      type: "website",
      locale: "da_DK",
    }),
    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
}

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt – Define waters A/S",
  description: "Kontakt os for et gratis tilbud på professionel rengøring.",
  url: PAGE_URL,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Kontakt", item: PAGE_URL },
    ],
  },
};

const INFO_ITEMS = [
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "E-mail",
    value: "info@define-waters.dk",
    href: "mailto:info@define-waters.dk",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Adresse",
    value: "Boeslunde Byvej 76",
    href: undefined,
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
    label: "Åbningstider",
    value: "Man–fre: 7:00–17:00",
    href: undefined,
  },
];

export default function Kontakt(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <JsonLd data={pageSchema} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-surface-dim py-20 border-b border-sky-100" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Brødkrumme">
              <Link to="/" className="hover:text-primary transition-colors">Forside</Link>
              <span aria-hidden="true">/</span>
              <span className="text-text font-medium">Kontakt</span>
            </nav>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Kontakt os</p>
              <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6 leading-tight tracking-tight">
                Vi er klar til at hjælpe dig
              </h1>
              <p className="text-xl text-text-muted leading-relaxed">
                Udfyld formularen herunder, og vi vender tilbage med et gratis tilbud inden for 24 timer.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24" style={{ contain: "layout style paint" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-secondary mb-8">Send os en besked</h2>
                <form
                  action="mailto:info@define-waters.dk"
                  method="get"
                  encType="text/plain"
                  className="space-y-6"
                  aria-label="Kontaktformular"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="navn" className="block text-sm font-semibold text-secondary mb-2">
                        Dit navn <span className="text-red-500" aria-label="påkrævet">*</span>
                      </label>
                      <input
                        id="navn"
                        name="navn"
                        type="text"
                        required
                        placeholder="Fornavn Efternavn"
                        className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-text-muted/50 bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-2">
                        E-mail <span className="text-red-500" aria-label="påkrævet">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="din@email.dk"
                        className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-text-muted/50 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="telefon" className="block text-sm font-semibold text-secondary mb-2">
                        Telefon
                      </label>
                      <input
                        id="telefon"
                        name="telefon"
                        type="tel"
                        placeholder="+45 12 34 56 78"
                        className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-text-muted/50 bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="tjeneste" className="block text-sm font-semibold text-secondary mb-2">
                        Tjeneste
                      </label>
                      <select
                        id="tjeneste"
                        name="tjeneste"
                        className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary bg-white"
                      >
                        <option value="">Vælg tjeneste...</option>
                        <option value="hjem">Hjemmerengøring</option>
                        <option value="erhverv">Erhvervsrengøring</option>
                        <option value="vinduer">Vinduespolering</option>
                        <option value="flytning">Til-/fraflytning</option>
                        <option value="industri">Industrirengøring</option>
                        <option value="andet">Andet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="adresse" className="block text-sm font-semibold text-secondary mb-2">
                      Adresse / lokation
                    </label>
                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      placeholder="Gadenavn 1, 4200 By"
                      className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-text-muted/50 bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="besked" className="block text-sm font-semibold text-secondary mb-2">
                      Besked <span className="text-red-500" aria-label="påkrævet">*</span>
                    </label>
                    <textarea
                      id="besked"
                      name="besked"
                      required
                      rows={5}
                      placeholder="Fortæl os om dit rengøringsbehov: størrelse, frekvens, specielle ønsker..."
                      className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-secondary placeholder:text-text-muted/50 bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.99]"
                  >
                    Send besked
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                  <p className="text-xs text-text-muted text-center">
                    Vi svarer inden for 24 timer på hverdage.
                  </p>
                </form>
              </div>

              {/* Contact Info */}
              <aside className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-secondary mb-8">Kontaktoplysninger</h2>
                <div className="space-y-6 mb-10">
                  {INFO_ITEMS.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-50 text-primary flex items-center justify-center flex-shrink-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={item.icon}/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-secondary font-semibold hover:text-primary transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-secondary font-semibold">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promise Box */}
                <div className="bg-surface-dim rounded-2xl p-7 border border-sky-100">
                  <h3 className="font-bold text-secondary mb-4 text-lg">Vores løfte til dig</h3>
                  <ul className="space-y-3">
                    {[
                      "Gratis og uforpligtende tilbud",
                      "Svar inden for 24 timer",
                      "Ingen skjulte gebyrer",
                      "Tilfredshedsgaranti",
                    ].map((promise) => (
                      <li key={promise} className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span className="text-sm text-text-muted">{promise}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 bg-primary rounded-2xl p-7">
                  <p className="text-white font-semibold mb-1">Foretrækker du e-mail?</p>
                  <a
                    href="mailto:info@define-waters.dk"
                    className="text-blue-100 hover:text-white transition-colors font-medium break-all"
                  >
                    info@define-waters.dk
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
