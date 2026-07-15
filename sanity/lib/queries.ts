import type { PortableTextBlock } from "@portabletext/react";
import { client } from "./client";

export type ProjectSection = {
  image: { asset: { _ref: string }; hotspot?: object };
  title: string;
  body: PortableTextBlock[];
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
  featured?: boolean;
  displayOrder?: number;
  description?: string;
  footprint?: string;
  typology?: string;
  status?: "available" | "retired";
  quote?: string;
  sections?: ProjectSection[];
  gallery?: { asset: { _ref: string }; hotspot?: object }[];
  crew?: string[];
  press?: { text?: string; url?: string }[];
};

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      _id, title, slug, image, city, year, placement, materials,
      description, footprint, typology, status, quote, sections, gallery, crew, press
    }`,
    { slug }
  );
}

// coalesce(...) covers the case where the "homepage" singleton hasn't been
// created yet in Studio — without it, `[0].field` on a missing document
// resolves to `null` (not an empty array), which breaks .map/.filter callers.
export async function getMarqueeArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `coalesce(*[_type == "homepage"][0].heroProjects[]-> {
      _id, title, city, year, placement, image
    }, [])`
  );
}

export async function getTouringArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `coalesce(*[_type == "homepage"][0].touringProjects[0...3]-> {
      _id, title, city, year, placement, materials, image
    }, [])`
  );
}

export async function getCommissionArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `coalesce(*[_type == "homepage"][0].commissionProjects[0...3]-> {
      _id, title, city, year, placement, materials, image
    }, [])`
  );
}

export async function getArtworksIndex(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "project"]
      | order(displayOrder asc, _createdAt asc) {
        _id, title, image, city, interactive, placement, featured, displayOrder, materials
      }`
  );
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
    image?: { asset: { _ref: string }; hotspot?: object };
  };
};

// `defined(geopoint)` filters at the query layer — locations with a venue
// name but no coordinates yet (not geocoded in Studio) never reach the map.
export async function getMapLocations(): Promise<MapLocation[]> {
  return client.fetch(
    `*[_type == "location" && defined(geopoint)]{
      _id, venueName, city, year, geopoint, locationState,
      "project": project->{ _id, title, "slug": slug.current, "image": image }
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
    const res = await client.fetch<{ uppercaseTitles?: boolean } | null>(
      `*[_type == "siteSettings"][0]{ uppercaseTitles }`,
      {},
      { next: { revalidate: 60 } }
    );
    return { uppercaseTitles: res?.uppercaseTitles ?? true };
  } catch {
    return { uppercaseTitles: true };
  }
}

