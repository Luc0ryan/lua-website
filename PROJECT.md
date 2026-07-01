# LUA Website — Project Reference

**Looking Up Arts** — interactive public art collective site.  
Stack: Next.js 16 (App Router) · Sanity 5 · Tailwind 4 · TypeScript · React 19

---

## Route Structure

```
app/
├── layout.tsx                    Root: fonts, metadata, html/body shell
├── globals.css                   Tailwind @theme + CSS variable definitions
├── (main)/
│   ├── layout.tsx                Injects <Nav> + <Footer> for all main pages
│   ├── page.tsx                  Home: Hero → Editorial → TouringHome → CommissionHome → InstagramGrid
│   ├── about/page.tsx
│   ├── artworks/
│   │   ├── page.tsx              Server: fetches all artworks, renders gallery
│   │   ├── ArtworksGallery.tsx   Client: filter state shell
│   │   ├── ArtworkGrid.tsx       Alternating 3-up / 2-up rows
│   │   ├── FilterBar.tsx         Filter pill UI
│   │   └── buildRows.ts          Array → Row[] split utility
│   ├── community/page.tsx
│   ├── contact/page.tsx
│   └── projects/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── components/
│   ├── Nav.tsx                   Fixed navbar — scroll-aware, mobile menu (client)
│   ├── Footer.tsx                Multi-column footer (server)
│   ├── ContactForm.tsx           HubSpot form (client)
│   ├── HeroAccordion.tsx         Flex-based accordion (client)
│   └── sections/
│       ├── Hero.tsx              Hero section with DotPanel background (server)
│       ├── Editorial.tsx
│       ├── HomeGallery.tsx       7/5 asymmetric gallery — shared by Touring/Commission (server)
│       ├── TouringHome.tsx       Fetches role="touring" artworks, feeds HomeGallery
│       ├── CommissionHome.tsx    Fetches role="commission" artworks, feeds HomeGallery
│       └── InstagramGrid.tsx     5-col desktop / 2-col mobile (server)
│   └── dot-system/
│       ├── index.ts
│       ├── DotPanel.tsx          Main dot pattern composite
│       ├── DotMask.tsx           Shaped masks (peak, etc.)
│       └── DotField.tsx          Dot renderer
└── studio/[[...tool]]/           Sanity Studio at /studio
```

---

## Design Tokens

CSS variables defined in `app/globals.css`, exposed to Tailwind via `@theme inline`.

| Variable | Value | Tailwind |
|---|---|---|
| `--bg` | `#F2EFEA` | `bg-bg` / `text-bg` |
| `--fg` | `#111111` | `text-fg` |
| `--pink` | `#DC738F` | `text-pink` / `bg-pink` |
| `--lua-pink` | `#C91F6E` | `text-lua-pink` |
| `--gray-label` | `#888` | `text-gray-label` |
| `--footer-bg` | `#E8E4DF` | `bg-footer-bg` |
| `--gutter` | `clamp(24px, 4vw, 64px)` | `px-gutter` / `mx-gutter` |

**Fonts** (loaded in `app/layout.tsx` via `next/font/google`):
- `DM Sans` → `--font-dm-sans` → applies to `h1–h6, .font-heading`
- `Inter` → `--font-inter` → body default

No `tailwind.config` file — Tailwind 4 reads everything from `globals.css`.

---

## Typography Conventions

Artwork card title pattern (eyebrow + title):
- **Eyebrow** (city/location): `text-xs uppercase tracking-wide text-fg/50`
- **Title**: `font-heading font-bold uppercase`
  - Featured cards: `text-[18px]`
  - Standard cards: `text-base`

---

## Image Conventions

- **Never** hardcode `.width()` / `.height()` on `urlFor` — use aspect ratios and let `sizes` drive resolution
- Builder: `import { urlFor } from "@/sanity/lib/image"` → `urlFor(image).fit("crop").url()`
- Hover scale (standard): `group-hover:scale-[1.03] transition-transform duration-500 ease-out` on `<Image>`, `group` on the wrapping `<div>`
- `next/image` remote pattern: `cdn.sanity.io` (configured in `next.config.ts`)
- Image formats: `avif`, `webp`

---

## Component Conventions

**Server vs Client**
- Default to server components (async, data-fetching)
- `"use client"` only for: state, events, scroll listeners, animations

**Props typing**
```typescript
type Props = { artworks: Artwork[] };
export default function Component({ artworks }: Props) { ... }
```

**Data fetching** — call query functions from `sanity/lib/queries.ts` directly in server components:
```typescript
const artworks = await getMarqueeArtworks();
```

**Asymmetric grids** (HomeGallery): desktop col splits are 7/5 using CSS grid.  
**Row builder** (ArtworkGrid): `buildRows()` splits flat arrays into alternating 3-col / 2-col rows.

---

## Sanity Schemas

### `artwork`

| Field | Type | Purpose |
|---|---|---|
| `title` | string | |
| `image` | image (hotspot) | |
| `city` | string | e.g. `"Jackson, TN"` |
| `placement` | `"touring" \| "permanent" \| "temporary"` | |
| `year` | number | |
| `interactive` | boolean | Enables Interactive filter tag |
| `featured` | boolean | Triggers 2-up featured row layout on /artworks |
| `displayOrder` | number | Position in /artworks gallery |
| `materials` | string[] (free tags) | Drives the Materials filter; matched case-insensitively in code |
| `role` | `"hero" \| "touring" \| "commission" \| null` | Homepage section placement — independent of `placement` |
| `heroOrder` | number | Position in hero accordion (role=hero) |
| `touringOrder` | number | Position in homepage Touring section (role=touring, max 3 shown) |
| `commissionOrder` | number | Position in homepage Commission section (role=commission, max 3 shown) |
| `description` | text | **Future** — reserved for the `/projects/[slug]` template, not rendered yet |

### `instagramPost`

| Field | Type | Notes |
|---|---|---|
| `image` | image (hotspot) | Required |
| `alt` | string | Required |
| `postUrl` | url | Link to original IG post |

---

## GROQ Queries (`sanity/lib/queries.ts`)

| Function | Filter | Order | Limit |
|---|---|---|---|
| `getMarqueeArtworks()` | `role == "hero"` | `heroOrder asc` | — |
| `getTouringArtworks()` | `role == "touring"` | `touringOrder asc` | 3 |
| `getCommissionArtworks()` | `role == "commission"` | `commissionOrder asc` | 3 |
| `getArtworksIndex()` | all | `displayOrder asc, _createdAt asc` | — |
| `getInstagramPosts()` | all | `_createdAt desc` | 10, revalidate 24h |

---

## TypeScript Types

```typescript
type Artwork = {
  _id: string;
  title: string;
  image: { asset: { _ref: string }; hotspot?: object };
  city?: string;
  year?: number;
  placement?: "touring" | "permanent" | "temporary";
  materials?: string[];
  interactive?: boolean;
  featured?: boolean;
  displayOrder?: number;
  role?: "hero" | "touring" | "commission";
  heroOrder?: number;
  touringOrder?: number;
  commissionOrder?: number;
  description?: string; // future — /projects/[slug], not rendered yet
};

type InstagramPost = {
  _id: string;
  image: { asset: { _ref: string }; hotspot?: object };
  alt: string;
  postUrl?: string;
};
```

---

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.x | Framework |
| `react` | 19.x | UI |
| `sanity` | 5.x | CMS + Studio |
| `@sanity/client` | 7.x | Data fetching |
| `@sanity/image-url` | 2.x | Image URL builder |
| `next-sanity` | 12.x | Next + Sanity integration |
| `tailwindcss` | 4.x | Styling (config-less, `@theme` in CSS) |
| `lucide-react` | 1.x | Icons |
| `stripe` | 22.x | Payments |
| `styled-components` | 6.x | Occasional CSS-in-JS |

---

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
```

---

## Metadata

- **Site title**: "Looking Up Arts"
- **Description**: "Interactive art built to bring people together."
- **Studio path**: `/studio`
- **Sanity API version**: `2024-01-01`
- **Sanity CDN**: enabled
