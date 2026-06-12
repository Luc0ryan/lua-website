import { defineField, defineType } from "sanity";

export const artworkSchema = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    // ── Core ──────────────────────────────────────────────────────────────────
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "city",
      title: "Location",
      type: "string",
      description: 'City / region shown on cards and in the hero, e.g. "Jackson, TN". Leave blank for touring works.',
    }),
    defineField({
      name: "placement",
      title: "Touring / Permanent",
      type: "string",
      options: {
        list: [
          { title: "Permanent", value: "permanent" },
          { title: "Temporary", value: "temporary" },
          { title: "Touring", value: "touring" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "year", title: "Year", type: "number" }),

    // ── Filters ───────────────────────────────────────────────────────────────
    defineField({
      name: "interactive",
      title: "Interactive",
      type: "boolean",
      description: "Enables the Interactive filter on the Artworks page.",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Featured pieces appear in the wider 2-up rows of the asymmetric grid.",
      initialValue: false,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Position on the Artworks page (lower = first). Falls back to creation date if unset.",
    }),

    // ── Homepage ──────────────────────────────────────────────────────────────
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

    // ── Details ───────────────────────────────────────────────────────────────
    defineField({ name: "description", title: "Description", type: "text" }),
    // TODO: connect to FilterBar materials dropdown at launch
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [{ type: "string" }],
      description: "Materials used in this work. Drives the Materials filter on the projects page.",
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    { title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }] },
    { title: "Hero order", name: "heroOrderAsc", by: [{ field: "heroOrder", direction: "asc" }] },
    { title: "Gallery order", name: "galleryOrderAsc", by: [{ field: "galleryOrder", direction: "asc" }] },
  ],
});
