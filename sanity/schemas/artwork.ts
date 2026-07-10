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
      description: 'City / region shown on cards and in the hero, e.g. "Jackson, TN".',
      hidden: ({ document }) => document?.placement === "touring",
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
    defineField({ name: "year", title: "Year", type: "number", hidden: ({ document }) => document?.placement === "touring" }),
    defineField({
      name: "touringLocations",
      title: "Touring Locations",
      type: "array",
      description:
        'Add a stop for each place this piece has toured. Year must be entered as a 4-digit year, e.g. "2024". Location is freeform — city and state/country works well, e.g. "Austin, TX" or "Berlin, Germany".',
      of: [
        {
          type: "object",
          name: "touringLocation",
          fields: [
            defineField({
              name: "location",
              title: "Location",
              type: "string",
              description: 'Freeform, e.g. "Austin, TX" or "Berlin, Germany".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "number",
              description: 'Enter as a 4-digit year, e.g. "2024".',
              validation: (Rule) =>
                Rule.required().integer().min(1900).max(2100).error("Enter a 4-digit year, e.g. 2024."),
            }),
          ],
          preview: {
            select: { location: "location", year: "year" },
            prepare: ({ location, year }) => ({
              title: [location, year].filter(Boolean).join(" · ") || "Untitled stop",
            }),
          },
        },
      ],
      hidden: ({ document }) => document?.placement !== "touring",
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
      name: "sections",
      title: "Sections",
      type: "array",
      description:
        "Optional — add up to 3 content breaks (image + title + body) for best results; no hard limit. Each section needs all three fields once added.",
      of: [
        {
          type: "object",
          name: "projectSection",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Bold", value: "strong" },
                      { title: "Italic", value: "em" },
                    ],
                    annotations: [
                      {
                        name: "link",
                        type: "object",
                        title: "Link",
                        fields: [{ name: "href", title: "URL", type: "url" }],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "Untitled section",
              media,
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(3).warning("Consider keeping this to 3 sections for readability."),
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
  ],
  orderings: [
    { title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }] },
  ],
});
