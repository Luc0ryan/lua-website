import { defineField, defineType } from "sanity";

export const artworkSchema = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: 'Display location, e.g. "Jackson, TN". Shown on card unless Touring is checked.',
    }),
    defineField({
      name: "touring",
      title: "Touring",
      type: "boolean",
      description: 'If checked, the card shows "Touring" instead of the city.',
      initialValue: false,
    }),
    defineField({
      name: "interactive",
      title: "Interactive",
      type: "boolean",
      description: "Mark as an interactive artwork for filtering.",
      initialValue: false,
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Touring", value: "touring" },
          { title: "Permanent", value: "permanent" },
        ],
        layout: "radio",
      },
      description: "Used for the Touring / Permanent filter.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Featured pieces appear in the wider 2-up rows on the Artworks index.",
      initialValue: false,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Manual sort position on the Artworks page (lower = first). Falls back to creation date.",
    }),
    // Legacy fields — kept for hero/gallery homepage roles
    defineField({ name: "location", title: "Location (legacy)", type: "string" }),
    defineField({
      name: "category",
      title: "Category (legacy)",
      type: "string",
      options: {
        list: [
          { title: "Interactive", value: "Interactive" },
          { title: "Public / Civic", value: "Public / Civic" },
          { title: "Festival / Event", value: "Festival / Event" },
        ],
      },
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
      title: "Artworks page order (legacy)",
      type: "number",
      description: "Use Display order instead for the new Artworks index.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }, { field: "_createdAt", direction: "asc" }] },
    { title: "Artworks page order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Hero order", name: "heroOrderAsc", by: [{ field: "heroOrder", direction: "asc" }] },
    { title: "Gallery order", name: "galleryOrderAsc", by: [{ field: "galleryOrder", direction: "asc" }] },
  ],
});
