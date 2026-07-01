import { client } from "./client";

export type Artwork = {
  _id: string;
  title: string;
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
};

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
