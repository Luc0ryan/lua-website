import { client } from "./client";

export type ArtworkIndexItem = {
  _id: string;
  title: string;
  city: string | null;
  touring: boolean;
  interactive: boolean;
  type: "touring" | "permanent" | null;
  image: { asset: { _ref: string }; hotspot?: object };
  featured: boolean;
  displayOrder: number | null;
};

export async function getIndexArtworks(): Promise<ArtworkIndexItem[]> {
  return client.fetch(
    `*[_type == "artwork"] | order(displayOrder asc, _createdAt asc) {
      _id, title, city, touring, interactive, type, image, featured, displayOrder
    }`
  );
}

export type Artwork = {
  _id: string;
  title: string;
  location: string;
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
      _id, title, location, category, image
    }`
  );
}

export async function getGalleryArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "gallery"] | order(galleryOrder asc) [0...6] {
      _id, title, location, category, image
    }`
  );
}

export async function getAllArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role != "hero" && role != "gallery"] | order(order asc, _createdAt asc) {
      _id, title, location, category, image, description, year, order
    }`
  );
}
