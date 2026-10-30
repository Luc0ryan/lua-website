import type { PortableTextBlock } from "@portabletext/react";
import { cache } from "react";
import { sanityFetch } from "./client";

export type ProjectSection = {
  image: { asset: { _ref: string }; hotspot?: object };
  title: string;
  body: PortableTextBlock[];
};

export type GalleryImage = {
  asset: { _ref: string };
  hotspot?: object;
  // Derived at query time from the asset's own dimensions — drives the
  // full-width vs grid layout instead of a manual per-image toggle.
  aspectRatio?: number;
};

export type Artwork = {
  _id: string;
  title: string;
  slug?: { current: string };
  image: { asset: { _ref: string }; hotspot?: object };
  city?: string;
  year?: number;
  placement?: "touring" | "permanent" | "exhibition";
  materials?: string[];
  interactive?: boolean;
  description?: string;
  footprint?: string;
  typology?: string;
  status?: "available" | "retired";
  quote?: string;
  sections?: ProjectSection[];
  gallery?: GalleryImage[];
  crew?: string[];
  press?: { text?: string; url?: string }[];
};

// cache() dedupes the fetch between generateMetadata and the page render.
export const getArtworkBySlug = cache(async (slug: string): Promise<Artwork | null> => {
  return sanityFetch<Artwork | null>(
    `*[_type == "project" && slug.current == $slug][0]{
      _id, title, slug, image, city, year, placement, materials,
      description, footprint, typology, status, quote, sections, crew, press,
      gallery[]{ ..., "aspectRatio": asset->metadata.dimensions.aspectRatio }
    }`,
    { slug }
  );
});

export async function getProjectSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  return sanityFetch<{ slug: string; updatedAt: string }[]>(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
  );
}

// coalesce(...) covers the case where the "homepage" singleton hasn't been
// created yet in Studio — without it, `[0].field` on a missing document
// resolves to `null` (not an empty array), which breaks .map/.filter callers.
export async function getMarqueeArtworks(): Promise<Artwork[]> {
  return sanityFetch<Artwork[]>(
    `coalesce(*[_type == "homepage"][0].heroProjects[]-> {
      _id, title, slug, city, year, placement, image
    }, [])`
  );
}

export async function getTouringArtworks(): Promise<Artwork[]> {
  return sanityFetch<Artwork[]>(
    `coalesce(*[_type == "homepage"][0].touringProjects[0...3]-> {
      _id, title, slug, city, year, placement, materials, image
    }, [])`
  );
}

export async function getCommissionArtworks(): Promise<Artwork[]> {
  return sanityFetch<Artwork[]>(
    `coalesce(*[_type == "homepage"][0].commissionProjects[0...3]-> {
      _id, title, slug, city, year, placement, materials, image
    }, [])`
  );
}

// "Commissioned" isn't a separate flag in this schema — permanent placement
// *is* a commission in LUA's client model (touring/exhibition pieces aren't
// site-specific commissions). Newest first, so this is literally "the last
// 3 commissioned projects uploaded."
export async function getRecentCommissionedArtworks(): Promise<Artwork[]> {
  return sanityFetch<Artwork[]>(
    `*[_type == "project" && placement == "permanent"]
      | order(_createdAt desc)[0...3] {
        _id, title, slug, city, year, placement, image
      }`
  );
}

// Donate page "what your gift builds" row. Exhibition pieces are the
// grant-funded festival works — permanent pieces are paid commissions, so
// showing them next to a donate form would overclaim what gifts fund.
export async function getDonorFundedArtworks(): Promise<Artwork[]> {
  return sanityFetch<Artwork[]>(
    `*[_type == "project" && placement == "exhibition" && defined(image)]
      | order(_createdAt desc)[0...3] {
        _id, title, slug, city, year, placement, image
      }`
  );
}

export async function getArtworksIndex(): Promise<Artwork[]> {
  return sanityFetch<Artwork[]>(
    `*[_type == "project"]
      | order(_createdAt asc) {
        _id, title, slug, image, city, year, interactive, placement, materials
      }`
  );
}

// Prefers other projects with the same placement (touring↔touring,
// permanent/exhibition↔permanent/exhibition); falls back to the most
// recently created projects site-wide to fill up to 3 when a placement
// type doesn't have enough siblings yet (e.g. after archiving).
export async function getRelatedArtworks(
  currentId: string,
  placement?: Artwork["placement"]
): Promise<Artwork[]> {
  const projection = `_id, title, slug, image, city, year, placement, materials`;

  const primary = placement
    ? await sanityFetch<Artwork[]>(
        `*[_type == "project" && _id != $id && placement == $placement]
          | order(_createdAt desc)[0...3]{${projection}}`,
        { id: currentId, placement }
      )
    : [];

  if (primary.length >= 3) return primary;

  const excludeIds = [currentId, ...primary.map((p) => p._id)];
  const fallback = await sanityFetch<Artwork[]>(
    `*[_type == "project" && !(_id in $excludeIds)]
      | order(_createdAt desc)[0...3]{${projection}}`,
    { excludeIds }
  );

  return [...primary, ...fallback].slice(0, 3);
}

export type MapLocation = {
  _id: string;
  venueName?: string;
  city?: string;
  year?: number;
  geopoint: { lat: number; lng: number };
  locationState: "current" | "past";
  project: {
    _id: string;
    title: string;
    slug?: string;
    placement?: "permanent" | "exhibition" | "touring";
    image?: { asset: { _ref: string }; hotspot?: object };
  };
};

// `defined(geopoint)` filters at the query layer — locations with a venue
// name but no coordinates yet (not geocoded in Studio) never reach the map.
// `past` only applies to touring projects; permanent and exhibition projects
// are always `current`, whatever the stored value says.
export async function getMapLocations(): Promise<MapLocation[]> {
  return sanityFetch<MapLocation[]>(
    `*[_type == "location" && defined(geopoint)]{
      _id, venueName, city, year, geopoint,
      "locationState": select(project->placement == "touring" => locationState, "current"),
      "project": project->{ _id, title, "slug": slug.current, placement, "image": image }
    }`
  );
}

export type StaffMember = {
  _id: string;
  name: string;
  role?: string;
  photo?: { asset: { _ref: string }; hotspot?: object };
  displayOrder?: number;
};

export async function getStaffMembers(): Promise<StaffMember[]> {
  return sanityFetch<StaffMember[]>(
    `*[_type == "staffMember"]
      | order(displayOrder asc, _createdAt asc) {
        _id, name, role, photo, displayOrder
      }`
  );
}

export type SiteSettings = {
  uppercaseTitles: boolean;
};

// Global Studio-controlled settings. Defaults to uppercase titles when no
// settings document exists yet or the fetch fails, so the site renders as
// designed out of the box.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await sanityFetch<{ uppercaseTitles?: boolean } | null>(
      `*[_type == "siteSettings"][0]{ uppercaseTitles }`
    );
    return { uppercaseTitles: res?.uppercaseTitles ?? true };
  } catch {
    return { uppercaseTitles: true };
  }
}

