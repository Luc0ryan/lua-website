import { getTouringArtworks, getCommissionArtworks, type Artwork } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { GalleryProject } from "@/app/components/sections/HomeGallery";

/**
 * Subtitle rule (AGENTS.md "Gallery card overlay"): permanent/exhibition pieces
 * show `city · year`; touring pieces show their first material, or "Touring"
 * if none is set.
 */
function gallerySubtitle(artwork: Artwork): string {
  if (artwork.placement === "touring") {
    return artwork.materials?.[0] ?? "Touring";
  }
  return [artwork.city, artwork.year?.toString()].filter(Boolean).join(" · ");
}

function toGalleryProject(artwork: Artwork): GalleryProject {
  return {
    key: artwork._id,
    title: artwork.title,
    subtitle: gallerySubtitle(artwork),
    image: artwork.image ? urlFor(artwork.image).url() : null,
  };
}

export async function getTouringGalleryProjects(): Promise<GalleryProject[]> {
  const artworks = await getTouringArtworks().catch(() => [] as Artwork[]);
  return artworks.map(toGalleryProject);
}

export async function getCommissionGalleryProjects(): Promise<GalleryProject[]> {
  const artworks = await getCommissionArtworks().catch(() => [] as Artwork[]);
  return artworks.map(toGalleryProject);
}
