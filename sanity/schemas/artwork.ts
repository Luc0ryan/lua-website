import { defineField, defineType } from "sanity";

export const artworkSchema = defineType({
  name: "artwork",
  title: "Project",
  type: "document",
  fields: [
    // ── Core ──────────────────────────────────────────────────────────────────
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the project page URL, e.g. /projects/rainbow-bridge.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
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
      description: "Enables the Interactive filter on the Projects page.",
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
      description: "Position on the Projects page (lower = first). Falls back to creation date if unset.",
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Materials used in this work. Drives the Materials filter on the Projects page. Free-text tags — the filter matches case-insensitively, so reuse existing wording (e.g. \"Steel\", not \"steel\") where it applies, but new tags are always fine to add.",
      options: { layout: "tags" },
    }),

    // ── Homepage ──────────────────────────────────────────────────────────────
    // `role` decides which homepage section (if any) shows this piece. It's
    // independent of `placement` above — a permanently-installed piece can still
    // be the Commission feature, and a touring piece doesn't have to be the
    // Touring feature. Each section shows at most 3, by its order field.
    defineField({
      name: "role",
      title: "Homepage role",
      type: "string",
      options: {
        list: [
          { title: "Hero (accordion banner)", value: "hero" },
          { title: "Touring (featured)", value: "touring" },
          { title: "Commission (featured)", value: "commission" },
        ],
        layout: "radio",
      },
      description: "Leave blank to show on the Projects page only.",
    }),
    defineField({
      name: "heroOrder",
      title: "Hero order",
      type: "number",
      description: "Position in the hero accordion (lower = first).",
      hidden: ({ document }) => document?.role !== "hero",
    }),
    defineField({
      name: "touringOrder",
      title: "Touring order",
      type: "number",
      description: "Position in the homepage Touring section (lower = first). Only the first 3 show.",
      hidden: ({ document }) => document?.role !== "touring",
    }),
    defineField({
      name: "commissionOrder",
      title: "Commission order",
      type: "number",
      description: "Position in the homepage Commission section (lower = first). Only the first 3 show.",
      hidden: ({ document }) => document?.role !== "commission",
    }),

    // ── Project page ──────────────────────────────────────────────────────────
    // Rendered on /projects/[slug].
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "footprint",
      title: "Footprint",
      type: "string",
      description: 'Physical size, e.g. "75ft x 30ft x 4ft".',
    }),
    defineField({
      name: "typology",
      title: "Typology",
      type: "string",
      description: 'Short type/category tag, e.g. "Walkable, LEDs".',
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Controls the booking link on the project page — only shown when Available to Rent.",
      options: {
        list: [
          { title: "Available to Rent", value: "available" },
          { title: "Retired", value: "retired" },
        ],
        layout: "radio",
      },
      initialValue: "available",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      description: "Optional pull quote shown alongside the description.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Image sequence shown below the main image. First image displays full-width, the rest in a 2-up grid.",
    }),
    defineField({
      name: "crew",
      title: "Crew",
      type: "array",
      of: [{ type: "string" }],
      description: "Names only, one per entry.",
    }),
    defineField({
      name: "press",
      title: "Press",
      type: "array",
      of: [
        {
          type: "object",
          name: "pressItem",
          fields: [
            defineField({ name: "text", title: "Text", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    { title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }] },
    { title: "Hero order", name: "heroOrderAsc", by: [{ field: "heroOrder", direction: "asc" }] },
    { title: "Touring order", name: "touringOrderAsc", by: [{ field: "touringOrder", direction: "asc" }] },
    { title: "Commission order", name: "commissionOrderAsc", by: [{ field: "commissionOrder", direction: "asc" }] },
  ],
});
