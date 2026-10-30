<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Conventions

## Project cards
Every project card is `app/components/ArtworkCard.tsx` — the Projects grid, homepage gallery, Commission "Selected Works", Related Works and Donate all use it. Don't build a new card; pass `size`, `aspect` and `sizes` instead. Pass the Sanity project as-is, and include `slug` in the query so the card links to its page.
- Overlay: a white box on the image, anchored bottom-right — not text below the image. `border-2 border-fg bg-bg shadow-[5px_5px_0_var(--fg)]`
- `size="md"` (grids, default) vs `size="lg"` (homepage, Commission) only changes the chip's padding and type scale
- Subtitle: `projectSubtitle()` in `lib/projectSubtitle.ts` — touring → `"Touring"`; permanent/exhibition → `city · year`. Also used by the hero and the project page.

## Homepage gallery layout
- Layout: 7:5 alternating columns (rows 1 & 3: 7-left/5-right; row 2: 5-left/7-right)
- 5-col is always `aspect-square`; 7-col uses `absolute inset-0` so the square drives row height
- Gap: `gap-4` (16px) for both column and row gutters
- Border radius: `rounded-[2px]` on all image containers

## Hover-scale on images
Only for images that link somewhere (cards). Decorative/static images — project page sections and gallery — get no hover effect.

Standard: `group-hover:scale-[1.03] transition-transform duration-500 ease-out` on the `<Image>`, with `group` on the wrapping `<div>`.
- Scale: `[1.03]` — subtle, not `scale-105` or `scale-110`
- Always use `group-hover` (not direct `hover:`) so the whole card is the hit target
- Always include `ease-out`
