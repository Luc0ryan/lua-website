<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Conventions

## Gallery card overlay
Artwork cards in the homepage gallery use a white box overlay on the image, anchored bottom-right — not text below the image.
- Style: `bg-white px-5 py-4 shadow-[5px_5px_0_#111]` matching the hero project card
- Subtitle: permanent/exhibition → `city · year`; touring → `materials[0]` or `"Touring"` if unset
- Layout: 7:5 alternating columns (rows 1 & 3: 7-left/5-right; row 2: 5-left/7-right)
- 5-col is always `aspect-square`; 7-col uses `absolute inset-0` so the square drives row height
- Gap: `gap-4` (16px) for both column and row gutters
- Border radius: `rounded-[2px]` on all image containers

## Hover-scale on images
Standard: `group-hover:scale-[1.03] transition-transform duration-500 ease-out` on the `<Image>`, with `group` on the wrapping `<div>`.
- Scale: `[1.03]` — subtle, not `scale-105` or `scale-110`
- Always use `group-hover` (not direct `hover:`) so the whole card is the hit target
- Always include `ease-out`
