# LUA Website — Developer Reference

For someone with basic/intermediate frontend knowledge. Not a tutorial — a reference
you can scan when you forget how something works.

---

## Running the project

```bash
cd lua-website
npm run dev        # start dev server → http://localhost:3000
```

Sanity Studio (the CMS dashboard) lives at `http://localhost:3000/studio`
once you've added a real project ID (see Sanity setup below).

---

## File map — what lives where

```
lua-website/
├── app/
│   ├── layout.tsx          ← fonts + html shell (wraps every page)
│   ├── globals.css         ← color variables, base styles
│   ├── page.tsx            ← homepage
│   ├── artworks/
│   │   ├── page.tsx        ← artworks gallery (server: fetches data)
│   │   └── ArtworksGallery.tsx  ← gallery UI (client: handles filter clicks)
│   ├── components/
│   │   ├── Nav.tsx         ← site navigation (client: scroll listener)
│   │   ├── HeroAccordion.tsx ← homepage hero (client: accordion state)
│   │   └── Footer.tsx      ← site footer (server: no interactivity)
│   └── studio/[[...tool]]/ ← Sanity Studio, don't touch
│
├── sanity/
│   ├── schemas/artwork.ts  ← defines what fields an "Artwork" has in the CMS
│   ├── lib/client.ts       ← Sanity connection config
│   ├── lib/queries.ts      ← GROQ queries (how you fetch CMS data)
│   └── lib/image.ts        ← image URL helper
│
├── sanity.config.ts        ← Sanity Studio config (schema registration)
├── .env.local              ← your secret keys (never commit this)
└── next.config.ts          ← Next.js config (image domains, etc.)
```

---

## The "server vs client" split — the one concept to understand

Next.js App Router has two kinds of components. You'll see this at the top of files:

```tsx
"use client"   // ← this component runs in the browser
               //   can use useState, useEffect, onClick, etc.

// (no directive) ← server component (default)
//   runs on the server, can fetch data directly, can't use useState
```

**Rule of thumb for this project:**
- Pages (`page.tsx`) are server components — they fetch from Sanity
- Anything interactive (clicking, hovering, state) is a client component

So the pattern you'll see repeatedly:
```
page.tsx (server)  →  fetches artworks from Sanity
    └── passes data as props to →  SomeClientComponent.tsx (client)
                                      handles clicks / filters / animation
```

You can't flip this — a server component can pass data *down* to a client
component, but not the other way around.

---

## Colors & design tokens

All colors are CSS variables defined in `app/globals.css`:

| Variable | Value | Used for |
|---|---|---|
| `--bg` | `#F2EFEA` | Page background (warm off-white) |
| `--fg` | `#111111` | Body text |
| `--magenta` | `#E8197D` | Accent — active pills, highlights |
| `--footer-bg` | `#E8E4DF` | Footer (slightly darker than page) |

In Tailwind classes you use them as `bg-[var(--bg)]` or the shorthand aliases
like `text-fg`, `bg-magenta` (these are registered in `@theme inline` in globals.css).

To change a color site-wide, edit the variable in `globals.css`. One change,
everywhere updates.

---

## Fonts

Two fonts loaded in `app/layout.tsx`:

- **DM Sans** (`--font-dm-sans`) — headings, nav, labels. CSS class: `font-heading`
- **Inter** (`--font-inter`) — body text. CSS class: `font-body`

To swap a font: change the import in `layout.tsx` (Next.js pulls it from Google
Fonts automatically — no manual `<link>` tags needed).

---

## Sanity CMS — setup & workflow

### First-time setup

1. Go to [sanity.io/manage](https://sanity.io/manage) → create a free project
2. Copy your **Project ID** from the project dashboard
3. Open `.env.local` and paste it:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
4. Restart `npm run dev`
5. Go to `http://localhost:3000/studio` → you'll see the CMS

### Adding artworks

In the Studio (`/studio`):
- Create a new **Artwork** document
- Fill in: title, location, category, image
- Toggle **Featured on homepage** → `true` to make it appear in the hero accordion
- Set **Display order** (1, 2, 3…) to control the order

The homepage hero shows up to 5 featured artworks.
The artworks gallery page shows all artworks.

### How the data flows

```
Sanity (CMS database)
    ↓  GROQ query in sanity/lib/queries.ts
    ↓  runs at page load on the server
app/page.tsx or app/artworks/page.tsx
    ↓  passes data as props
HeroAccordion.tsx / ArtworksGallery.tsx
    ↓  renders it
Browser
```

GROQ is Sanity's query language. It looks like:
```
*[_type == "artwork" && featured == true] | order(order asc) [0...5]
```
Read it as: "give me all documents of type artwork, where featured is true,
sorted by order, max 5 results."

---

## The hero accordion — how it works

File: `app/components/HeroAccordion.tsx`

The mechanic is pure CSS flexbox — no animation library needed:

```tsx
// Active panel: takes up most of the space
className={isActive ? "flex-[5]" : "flex-[0.4] hover:flex-[0.55]"}
```

`flex-[5]` means "grow to 5x the base unit." `flex-[0.4]` means "shrink to a narrow strip."
Tailwind's `transition-all duration-500` handles the smooth animation between states.

`activeIdx` is just a number (0, 1, 2…) stored in `useState`. Clicking a panel
sets `setActiveIdx(i)`, which causes the classes to update, which causes the
CSS transition to animate.

---

## The artworks filter — how it works

File: `app/artworks/ArtworksGallery.tsx`

```tsx
const [active, setActive] = useState<string | null>(null);
// null = show all, "Interactive" = show only Interactive, etc.

const filtered = active ? artworks.filter((a) => a.category === active) : artworks;
```

The pill buttons toggle `active`. The grid re-renders with the filtered list.
No page reload — it's all in-browser state.

---

## Making common changes

### Change the "Transforming public space" text
→ `app/page.tsx`, look for the `{/* Mid — editorial section */}` comment

### Change nav links
→ `app/components/Nav.tsx`, edit the `links` array at the top

### Add a new footer column
→ `app/components/Footer.tsx`, add an entry to the `cols` array

### Add a new artwork category for filtering
→ `sanity/schemas/artwork.ts` — add to the `options.list` array
→ `app/artworks/ArtworksGallery.tsx` — add to the `CATEGORIES` array

### Change how many artworks show in the hero
→ `sanity/lib/queries.ts` — change `[0...5]` to `[0...4]` etc.

### Add a new page (e.g. /about)
1. Create `app/about/page.tsx`
2. Add `import Nav from "../components/Nav"` and `import Footer from "../components/Footer"`
3. Link to it in `Nav.tsx`'s `links` array

---

## Image domains

If you add images from an external URL (not Sanity), you'll get an error.
Fix: add the domain to `next.config.ts`:

```ts
images: {
  remotePatterns: [{ hostname: "your-image-host.com" }],
},
```

Sanity images work automatically because they come through the `urlFor()` helper
which builds the right URL format.

---

## What "build" means and when to run it

```bash
npm run build   # compiles everything for production
npm run dev     # what you use during development (hot reload)
```

`npm run build` is useful to catch errors before deploying. If it passes,
the site will work on Vercel. You don't need to run it during day-to-day work.

---

## Deploying to Vercel (when ready)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → import the repo
3. Add your environment variables in Vercel's dashboard (same as `.env.local`)
4. Deploy — Vercel detects Next.js automatically

Every push to `main` after that triggers a redeploy.
