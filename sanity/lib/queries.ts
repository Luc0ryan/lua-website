import { client } from "./client";

export type Artwork = {
  _id: string;
  title: string;
  image: { asset: { _ref: string }; hotspot?: object };
  city?: string;
  year?: number;
  placement?: "touring" | "permanent";
  interactive?: boolean;
  featured?: boolean;
  displayOrder?: number;
  role?: "hero" | "gallery";
  heroOrder?: number;
  galleryOrder?: number;
  description?: string;
};

export async function getHeroArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "hero"] | order(heroOrder asc) [0...5] {
      _id, title, city, image
    }`
  );
}

export async function getGalleryArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && role == "gallery"] | order(galleryOrder asc) [0...6] {
      _id, title, city, image
    }`
  );
}

export async function getArtworksIndex(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork"]
      | order(displayOrder asc, _createdAt asc) {
        _id, title, image, city, interactive, placement, featured, displayOrder
      }`
  );
}
