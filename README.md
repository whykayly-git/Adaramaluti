# Adaramaluti House of Fashion

A production-ready Next.js storefront for Adaramaluti House of Fashion — a Nigerian luxury
fashion house — with a built-in e-commerce store that accepts payments from customers in Nigeria
and abroad.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** — theme colors defined in [`app/globals.css`](app/globals.css)
- **Poppins** via `next/font/google`
- **Zustand** — cart, wishlist and currency state (persisted to `localStorage`)
- **React Hook Form + Zod** — checkout, bespoke and contact forms
- **Lucide React** — icons
- **Paystack, Stripe, Flutterwave** — payments

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in your test/sandbox keys
npm run dev
```

Open [http://localhost:4100](http://localhost:4100).

## Project Structure

```
app/                  Routes (App Router) — pages + API routes
  api/payments/        Paystack, Stripe and Flutterwave routes
components/
  ui/                  Generic building blocks (Button, Logo, Container, ...)
  layout/              Navbar, Footer, CartDrawer, WhatsAppButton, ...
  home/, shop/, checkout/, bespoke/, contact/, legal/
data/                  Product/collection/lookbook accessors (DB-backed, see lib/db.ts) + seed-*.ts
lib/                   site-config, currency, shipping, payments/, validation/, db.ts, admin-*.ts
store/                 Zustand stores (cart, wishlist, currency)
types/                 Shared TypeScript types
```

## Editing Brand Details

Brand details (name, tagline, logo, contact info, social links) are editable live at
**`/admin/settings`** — see [Admin Dashboard](#admin-dashboard) below. [`lib/site-config.ts`](lib/site-config.ts)
only holds the *default* values used until an admin overrides them (and the values used by a
handful of admin-only, non-live-editable spots like the login page branding).

The logo file is `public/images/logo.png`. The supplied source photo has a textured background,
so the `Logo` component renders it inside a white rounded badge everywhere it appears, keeping it
readable against both light and dark surfaces. Swap in a version with a transparent/white
background at that path for a cleaner look, then re-run:

```bash
node scripts/generate-icons.mjs   # regenerates app/icon.png and app/apple-icon.png
```

## Currency

Prices are stored in NGN (`priceNGN` on each product) and converted for display using the static
rates in [`lib/currency.ts`](lib/currency.ts). To use live rates, replace `exchangeRates` with a
fetch to a rates API (e.g. exchangerate.host, Open Exchange Rates) on a schedule/cron, or fetch on
each request inside a server component and pass the rates down.

Visitors from Nigeria are defaulted to NGN and everyone else to USD, detected via
`proxy.ts` (using the `x-vercel-ip-country` header on Vercel) — this can be manually
overridden at any time with the currency switcher in the navbar.

## Payments

| Currency | Primary Provider | Alternative |
|---|---|---|
| NGN | Paystack (cards, bank transfer, USSD) | Flutterwave |
| USD / GBP / EUR | Stripe (cards, Apple Pay, Google Pay) | Flutterwave |

Each provider has its own API route under `app/api/payments/`:

- **`/api/payments/paystack`** — `POST` initializes a transaction and returns an
  `authorization_url` to redirect to; `GET ?reference=` verifies it server-side via Paystack's
  verify endpoint before the order confirmation page marks the order as paid.
- **`/api/payments/stripe`** — `POST` creates a Stripe Checkout Session; `GET ?session_id=`
  retrieves it for the confirmation page. `/api/payments/stripe/webhook` verifies the
  `checkout.session.completed` event via Stripe's signature check — this is the source of truth
  for marking an order paid in a real deployment.
- **`/api/payments/flutterwave`** — `POST` initializes a payment and returns a `link` to redirect
  to; `GET ?transaction_id=` verifies it server-side via Flutterwave's verify endpoint.

All secret keys are read from environment variables server-side only (see `.env.example`) — they
are never exposed to the browser.

This project has no database, so orders are kept in `sessionStorage` on the client between
checkout and the confirmation page (see `lib/order.ts`), and payments are verified server-side
before the receipt is shown. **For a real deployment, replace this with a database**: create the
order when checkout starts, and mark it paid from the verify/webhook routes instead of trusting
the client redirect alone.

### Getting sandbox/test keys

- **Paystack**: create an account at [paystack.com](https://paystack.com), then find your test
  secret key under *Settings → API Keys & Webhooks*.
- **Stripe**: create an account at [stripe.com](https://stripe.com), then find your test secret
  key under *Developers → API keys*. Create a webhook endpoint pointing at
  `https://<your-domain>/api/payments/stripe/webhook` for the `checkout.session.completed` event
  to get a webhook signing secret.
- **Flutterwave**: create an account at [flutterwave.com](https://flutterwave.com), then find your
  test secret key under *Settings → API*.

### Switching to live keys

Replace the `sk_test_...` / `FLWSECK_TEST-...` keys in your environment with their live
equivalents (`sk_live_...` / `FLWSECK-...`), and create a live-mode Stripe webhook endpoint. No
code changes are required.

## Admin Dashboard

Everything below lives in a local SQLite database (via Node's built-in `node:sqlite`, see
[`lib/db.ts`](lib/db.ts)), editable at **`/admin`**, protected by a signed, password-gated session
(see [`lib/admin-auth.ts`](lib/admin-auth.ts) and `proxy.ts`):

- **`/admin`** — Submissions: bespoke requests and contact messages, newest first.
- **`/admin/products`** — full product management: add, edit, delete, prices, sizes, colors,
  images (by URL), stock and featured status. Changes are live on `/shop` immediately.
- **`/admin/collections`** — add, edit, delete collections shown on `/collections` and the home page.
- **`/admin/lookbook`** — add or remove images from the `/lookbook` gallery.
- **`/admin/settings`** — brand details (name, tagline, logo, email, phone, WhatsApp, address,
  social links — shown in the navbar, footer, home hero, receipts, metadata, etc.), plus the
  Shipping & Returns, Privacy Policy, Terms of Service and Contact page content.
- **`/admin/admins`** — manage who has dashboard access (see below).

The product/collection/lookbook data that used to live in static files now lives in the database,
seeded once on first run from `data/seed-products.ts`, `data/seed-collections.ts` and
`data/seed-lookbook.ts`. `data/products.ts`, `data/collections.ts` and `data/lookbook.ts` are thin,
DB-backed accessor functions — the rest of the app (shop, product pages, home, sitemap, etc.)
reads through those and never touches `lib/db.ts` directly. Brand settings work the same way via
`lib/site-settings.ts`, and legal/info page text via `lib/page-content.ts`.

Legal/info page content uses a lightweight markdown-lite convention (`## Heading`, `- bullet`,
blank lines between blocks), rendered by `<MarkdownLite>` — plain text in, React elements out, no
`dangerouslySetInnerHTML`.

**Editing something and not seeing it change?** Every admin write calls `revalidatePath("/", "layout")`
so edits show up immediately even on pages Next.js prerendered at build time — this matters in
production (`next build && next start`), where pages without dynamic data are statically cached;
in `next dev` everything re-renders on every request regardless, so this distinction is invisible
locally. If you add a new admin-editable field somewhere, make sure whatever route writes it also
revalidates.

### Admin accounts

There's no sign-up page — accounts are invite-only, created from inside the dashboard
(`/admin/admins`) by an existing admin. That has a bootstrapping problem for the very first login,
solved like this: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` (see `.env.example`). The
first successful login with those exact credentials creates that admin account for real, in the
database — after that, invite further admins from `/admin/admins` instead of relying on the env
vars again. An admin can't remove their own account or the last remaining admin, so there's always
at least one way in.

**Forgot a password?** There's no email service wired up, so recovery uses a separate
`ADMIN_RECOVERY_CODE` secret instead of an emailed link: `/admin/login` → *Forgot password?* →
enter the admin's email, the recovery code, and a new password. This calls
`/api/admin/reset-password`, which stores a salted scrypt hash in the database (see
`lib/admin-password.ts`). Keep the recovery code as secret as a password — anyone with it can
reset any admin's login.

### Note on hosting

The SQLite file lives at `.data/app.db` on disk. This works well on a host with a persistent
filesystem, but resets on every deploy on an ephemeral/serverless host (e.g. Vercel) and isn't
shared across server instances. Swap `lib/db.ts` for a hosted database (Turso, Supabase, Postgres)
before relying on this — submissions, admin accounts, products and collections — in that kind of
production deployment.

## Shipping

Shipping zones and rates are configured in [`lib/shipping.ts`](lib/shipping.ts) — Lagos, other
Nigerian states, and international, each with its own rate and delivery estimate.

## SEO

Per-page metadata, Open Graph tags (including a generated `/opengraph-image`), `sitemap.ts` and
`robots.ts` are all wired up out of the box.

## Build

```bash
npm run build
npm run start
```
