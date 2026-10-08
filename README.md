# Looking Up Arts website

Next.js (App Router) + Sanity CMS + Stripe donations + HubSpot forms + Mapbox.

> This repo uses a newer Next.js than most docs cover — see `AGENTS.md` and `node_modules/next/dist/docs/`.

## Setup

```bash
cp .env.example .env.local   # fill in Sanity, HubSpot, Stripe, Mapbox, SITE_URL
npm install
npm run dev                  # site at :3000, Studio at /studio
```

`SITE_URL` is the canonical origin (no trailing slash). Stripe return URLs, the sitemap and metadata all use it — it is required in production.

## Scripts

- `npm run lint` · `npm run build`
- `scripts/*.mjs` are one-off Sanity migrations; run with `node --env-file=.env.local scripts/<name>.mjs`.

See `TODO.md` for launch tasks and map handoff.
