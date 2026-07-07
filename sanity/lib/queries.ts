import { client } from "./client";

export type Artwork = {
  _id: string;
  title: string;
  slug?: { current: string };
  image: { asset: { _ref: string }; hotspot?: object };
  city?: string;
  year?: number;
  placement?: "touring" | "permanent" | "temporary";
  materials?: string[];
  interactive?: boolean;
  featured?: boolean;
  displayOrder?: number;
  role?: "hero" | "touring" | "commission";
  heroOrder?: number;
  touringOrder?: number;
  commissionOrder?: number;
  description?: string;
  footprint?: string;
  typology?: string;
  status?: "available" | "retired";
  quote?: string;
  gallery?: { asset: { _ref: string }; hotspot?: object }[];
  crew?: string[];
  press?: { text?: string; url?: string }[];
};

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  return client.fetch(
    `*[_type == "artwork" && slug.current == $slug][0]{
      _id, title, slug, image, city, year, placement, materials,
      description, footprint, typology, status, quote, gallery, crew, press
    }`,
    { slug }
  );
}

export async function getMarqueeArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "hero"] | order(heroOrder asc) {
      _id, title, city, year, placement, image
    }`
  );
}

export async function getTouringArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "touring"] | order(touringOrder asc) [0...3] {
      _id, title, city, year, placement, materials, image
    }`
  );
}

export async function getCommissionArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "commission"] | order(commissionOrder asc) [0...3] {
      _id, title, city, year, placement, materials, image
    }`
  );
}

export async function getArtworksIndex(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork"]
      | order(displayOrder asc, _createdAt asc) {
        _id, title, image, city, interactive, placement, featured, displayOrder, materials
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

export type InstagramPost = {
  _id: string;
  image: { asset: { _ref: string }; hotspot?: object };
  alt?: string;
  postUrl?: string;
};

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  return client.fetch(
    `*[_type == "instagramPost"] | order(_createdAt desc) [0...10] {
      _id, image, alt, postUrl
    }`,
    {},
    { next: { revalidate: 86400 } }
  );
}
