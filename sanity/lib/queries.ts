import { client } from "./client";

export type Artwork = {
  _id: string;
  title: string;
  location: string;
  category: string;
  image: { asset: { _ref: string }; hotspot?: object };
  description?: string;
  year?: number;
  featured?: boolean;
  order?: number;
};

export async function getAllArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork"] | order(order asc, _createdAt asc) {
      _id, title, location, category, image, description, year, featured, order
    }`
  );
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && featured == true] | order(order asc) [0...5] {
      _id, title, location, category, image
    }`
  );
}
