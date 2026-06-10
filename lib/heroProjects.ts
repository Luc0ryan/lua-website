import { getMarqueeArtworks, type Artwork } from "@/sanity/lib/queries";

/**
 * Marquee frame shape, isolated here so the hero components never touch
 * Sanity types directly — swap the fetch/mapping without touching components.
 */
export type HeroProject = {
  key: string;
  title: string;
  href: string;
  image: Artwork["image"];
  /** One-line metadata, rendered before the title: "Jackson, TN · 2024" or "Touring". */
  meta: string;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toHeroProject(artwork: Artwork): HeroProject {
  const meta =
    artwork.placement === "touring"
      ? // TODO real data: venue count not in schema yet — "Touring · N venues" once it is
        "Touring"
      : [artwork.city, artwork.year].filter(Boolean).join(" · ");

  return {
    key: artwork._id,
    title: artwork.title,
    href: `/projects/${slugify(artwork.title)}`,
    image: artwork.image,
    meta,
  };
}

/** Alternate permanent/touring in the data order; leftovers append in CMS order. */
function interleaveByPlacement(artworks: Artwork[]): Artwork[] {
  const permanent = artworks.filter((a) => a.placement !== "touring");
  const touring = artworks.filter((a) => a.placement === "touring");
  const result: Artwork[] = [];
  const max = Math.max(permanent.length, touring.length);

  for (let i = 0; i < max; i++) {
    if (i < permanent.length) result.push(permanent[i]);
    if (i < touring.length) result.push(touring[i]);
  }
  return result;
}

export async function getHeroProjects(): Promise<HeroProject[]> {
  const artworks = await getMarqueeArtworks().catch(() => [] as Artwork[]);
  return interleaveByPlacement(artworks.filter((a) => a.image)).map(toHeroProject);
}
