import { defineField, defineType } from "sanity";

export const artworkSchema = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Interactive", value: "Interactive" },
          { title: "Public / Civic", value: "Public / Civic" },
          { title: "Festival / Event", value: "Festival / Event" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({
      name: "role",
      title: "Homepage role",
      type: "string",
      options: {
        list: [
          { title: "Hero (accordion banner)", value: "hero" },
          { title: "Gallery (project grid)", value: "gallery" },
        ],
        layout: "radio",
      },
      description: "Leave blank to show on Artworks page only.",
    }),
    defineField({
      name: "heroOrder",
      title: "Hero order",
      type: "number",
      description: "Position in the hero accordion (lower = first).",
      hidden: ({ document }) => document?.role !== "hero",
    }),
    defineField({
      name: "galleryOrder",
      title: "Gallery order",
      type: "number",
      description: "Position in the homepage project grid (lower = first).",
      hidden: ({ document }) => document?.role !== "gallery",
    }),
    defineField({
      name: "order",
      title: "Artworks page order",
      type: "number",
      description: "Position on the Artworks page.",
    }),
  ],
  orderings: [
    { title: "Artworks page order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Hero order", name: "heroOrderAsc", by: [{ field: "heroOrder", direction: "asc" }] },
    { title: "Gallery order", name: "galleryOrderAsc", by: [{ field: "galleryOrder", direction: "asc" }] },
  ],
});
