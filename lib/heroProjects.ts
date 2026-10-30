import { getMarqueeArtworks, type Artwork } from "@/sanity/lib/queries";
import { projectSubtitle } from "@/lib/projectSubtitle";

/**
 * Marquee frame shape, isolated here so the hero components never touch
 * Sanity types directly — swap the fetch/mapping without touching components.
 */
export type HeroProject = {
  key: string;
  title: string;
  /** Project page, or null when the project has no slug yet. */
  href: string | null;
  image: Artwork["image"];
  /** One-line metadata above the title: "Jackson, TN · 2024" or "Touring". */
  meta: string;
};

function toHeroProject(artwork: Artwork): HeroProject {
  return {
    key: artwork._id,
    title: artwork.title,
    href: artwork.slug?.current ? `/projects/${artwork.slug.current}` : null,
    image: artwork.image,
    meta: projectSubtitle(artwork),
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
