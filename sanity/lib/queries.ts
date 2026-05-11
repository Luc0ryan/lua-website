import { client } from "./client";

export type Artwork = {
  _id: string;
  title: string;
  city?: string;
  category: string;
  image: { asset: { _ref: string }; hotspot?: object };
  description?: string;
  year?: number;
  role?: "hero" | "gallery";
  heroOrder?: number;
  galleryOrder?: number;
  order?: number;
};

export async function getHeroArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "hero"] | order(heroOrder asc) [0...5] {
      _id, title, city, category, image
    }`
  );
}

export async function getGalleryArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "gallery"] | order(galleryOrder asc) [0...6] {
      _id, title, city, category, image
    }`
  );
}

export async function getAllArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role != "hero" && role != "gallery"] | order(order asc, _createdAt asc) {
      _id, title, city, category, image, description, year, order
    }`
  );
}

// ── Artworks index ────────────────────────────────────────────────────────────

export type ArtworkIndex = {
  _id: string;
  title: string;
  image: { asset: { _ref: string }; hotspot?: object };
  city?: string;
  interactive?: boolean;
  type?: "touring" | "permanent";
  featured?: boolean;
  displayOrder?: number;
};

export async function getArtworksIndex(): Promise<ArtworkIndex[]> {
  return client.fetch(
    `*[_type == "artwork"]
      | order(displayOrder asc, _createdAt asc) {
        _id, title, image, city, interactive, type, featured, displayOrder
      }`
  );
}
