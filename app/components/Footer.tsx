import { Link } from "react-router";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="logo" to="/" aria-label="Rengøringsfirma — Forside">
              <span className="logo-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 11l8-7 8 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </span>
              Rengøringsfirma
            </Link>
            <p>
              Professionel erhvervsrengøring i hele Danmark siden 2010. Fast team,
              dokumenteret kvalitet og svanemærkede produkter.
            </p>
          </div>

          <div className="fcol">
            <h5>Ydelser</h5>
            <Link to="/tjenester">Kontorrengøring</Link>
            <Link to="/tjenester">Vinduespolering</Link>
            <Link to="/tjenester">Trappevask</Link>
            <Link to="/tjenester">Flytterengøring</Link>
          </div>

          <div className="fcol">
            <h5>Firma</h5>
            <Link to="/om-os">Om os</Link>
            <Link to="/#dækning">Dækning</Link>
            <Link to="/#anmeldelser">Anmeldelser</Link>
            <Link to="/kontakt">Kontakt</Link>
          </div>

          <div className="fcol">
            <h5>Kontakt</h5>
            <a href="tel:+4570123456">+45 70 12 34 56</a>
            <a className="foot-email" href="mailto:kontakt@rengoeringsfirma.dk">kontakt@rengoeringsfirma.dk</a>
            <a>CVR 12 34 56 78</a>
          </div>
        </div>

        <div className="foot-bot">
          <span>© {year} Rengøringsfirma ApS. Alle rettigheder forbeholdes.</span>
          <span>Handelsbetingelser · Privatlivspolitik · Cookies</span>
        </div>
      </div>
    </footer>
  );
}
