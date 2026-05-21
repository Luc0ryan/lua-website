<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Conventions

## Hover-scale on images
Standard: `group-hover:scale-[1.03] transition-transform duration-500 ease-out` on the `<Image>`, with `group` on the wrapping `<div>`.
- Scale: `[1.03]` — subtle, not `scale-105` or `scale-110`
- Always use `group-hover` (not direct `hover:`) so the whole card is the hit target
- Always include `ease-out`
