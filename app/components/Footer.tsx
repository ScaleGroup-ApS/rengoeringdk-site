import { Link } from "react-router";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="logo" to="/" aria-label="Define Cleaning Services — Forside">
              <img src="/logo.svg" alt="Define Cleaning Services" className="logo-img" />
            </Link>
            <p>
              Professionel rengøring i hele Danmark. Fast team,
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
            <a className="foot-email" href="mailto:info@define-cleaning.dk">info@define-cleaning.dk</a>
            <a>CVR 40 68 10 86</a>
          </div>
        </div>

        <div className="foot-bot">
          <span>© {year} Define Cleaning Services ApS. Alle rettigheder forbeholdes.</span>
          <span>Handelsbetingelser · Privatlivspolitik · Cookies</span>
        </div>
      </div>
    </footer>
  );
}
