import type { Artwork } from "@/sanity/lib/queries";

/**
 * The one subtitle rule for every project card, the hero and the project page:
 * touring → "Touring"; permanent/exhibition → "City · Year" (either part may
 * be missing).
 */
export function projectSubtitle(a: Pick<Artwork, "placement" | "city" | "year">): string {
  if (a.placement === "touring") return "Touring";
  return [a.city, a.year].filter(Boolean).join(" · ");
}
