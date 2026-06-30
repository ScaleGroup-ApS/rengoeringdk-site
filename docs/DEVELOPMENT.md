# define-app — local development, seeding & testing

This is the customer/admin web app that lives at **`/app`** (in production:
`app.define-cleaning.dk`). It runs on the same React Router 7 + Drizzle +
MariaDB stack as the marketing site.

Below is a copy‑paste walkthrough that assumes no prior setup.

---

## 1. What you need

- **Node.js 20+** (check with `node -v`)
- **Docker** (the easiest way to get a database). Alternatively, any local
  MySQL 8 / MariaDB 11.

---

## 2. Start a database (Docker, one command)

```bash
docker run --name define-db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=define_dev \
  -p 3306:3306 -d mysql:8
```

Wait ~20 seconds for it to boot the first time. (To stop it later:
`docker stop define-db`; to start again: `docker start define-db`; to wipe it
completely and start fresh: `docker rm -f define-db` then re-run the command.)

---

## 3. Tell the app how to reach the database

In the **same terminal** you'll use for the next steps, paste:

```bash
export DB_HOST=127.0.0.1 DB_PORT=3306 DB_USER=root DB_PASSWORD=secret DB_NAME=define_dev
export SESSION_SECRET=dev-secret-please-change
export SEED_ADMIN_EMAIL=admin@define-cleaning.dk SEED_ADMIN_PASSWORD=Admin1234
```

(These mirror `.env.example`. They only live in this terminal session — if you
open a new terminal, paste them again.)

---

## 4. Install, create tables, seed data

```bash
npm install        # first time only
npm run db:migrate # creates the app_* tables
npm run db:seed    # loads the prisberegner prices + the admin account
```

`db:seed` is **safe to run again** — it won't create duplicates.
What it creates:
- All prisberegner prices (same numbers as the public calculator)
- An **admin** login: `admin@define-cleaning.dk` / `Admin1234`

---

## 5. Run the app

```bash
npm run dev
```

Open:
- **The app:** http://localhost:5175/app
- The marketing site: http://localhost:5175/

---

## 6. Test walkthrough (click-by-click)

### A. Admin
1. Go to http://localhost:5175/app/login and log in with
   `admin@define-cleaning.dk` / `Admin1234`.
2. You land on the **Dashboard** — note the **Kunder** (customers) count.
3. Open **Prisberegner**, change a number (e.g. a m² rate), click **Gem priser**.
4. Open the public calculator at http://localhost:5175/priser — your change is
   live there.

### B. Customer
1. In a new browser tab (or a private window), go to
   http://localhost:5175/app/register and create a customer
   (pick **Privat** to test servicefradrag later).
2. Click **Book ny rengøring**. Choose a service, drag the m² slider, and pick
   **Frekvens = Ugentligt** (weekly). Choose a date and send.
3. You'll see it under **Mine bookinger** as *Afventer*.

### C. Recurring auto-generation
1. Back in the **admin** tab → **Bookinger** → find the new request →
   **Håndtér** → **Bekræft** (pick a date).
2. Because the customer chose *Ugentligt*, the app auto-creates the upcoming
   weekly visits (~12 weeks ahead).
3. In the **customer** tab, refresh **Mine bookinger** → you now see a
   **"Faste aftaler"** card. Expand **Se alle besøg** to see every upcoming
   visit. Try **Aflys hele aftalen** to cancel the whole series.

### D. Servicefradrag / receipt
1. The receipt only counts **delivered** visits (completed, or past‑dated
   confirmed visits). Quickest way to see it populate:
   - As **admin**, on a booking click **Markér udført** (mark done), **or**
   - book a visit with a **date in the past** and confirm it.
2. As the **customer**, open the dashboard → **Kvittering & servicefradrag**
   (or http://localhost:5175/app/kvittering).
3. You'll see the yearly receipt, totals, the **estimated servicefradrag**
   (private customers), and a **Print / gem som PDF** button.

---

## 7. Resetting

- Re-run `npm run db:seed` any time (idempotent).
- To wipe everything: `docker rm -f define-db`, then repeat from step 2.

---

## 8. Seeding & secrets in production (Kubernetes)

The deploy pipeline runs `db:migrate` automatically before each rollout. Seeding
is a **one-time** manual step.

1. Create the `app-secrets` secret in the `rengoeringdk` namespace:
   ```bash
   kubectl create secret generic app-secrets -n rengoeringdk \
     --from-literal=SESSION_SECRET="$(openssl rand -hex 32)" \
     --from-literal=SEED_ADMIN_EMAIL="you@define-cleaning.dk" \
     --from-literal=SEED_ADMIN_PASSWORD="<a-strong-password>"
   ```
2. After the first deploy (tables migrated), run the seed once:
   ```bash
   # substitute {{NAMESPACE}}/{{CUSTOMER_ID}}/{{CUSTOMER_SLUG}} = rengoeringdk first
   kubectl apply -f infra/seed-job.yaml
   ```
3. Log in, **change the admin password**, then delete the seed admin secret
   keys. `SESSION_SECRET` must stay (it signs login cookies).

> Note: the public hostname `app.define-cleaning.dk` is wired up at the
> ScaleWeb ingress layer (not in this repo) — point it at the existing
> `customer-site` Service with TLS.
