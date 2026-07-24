import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "core", title: "Core", default: true },
    { name: "page", title: "Project Page" },
    { name: "filters", title: "Filters" },
  ],
  fields: [
    // ── Core ──────────────────────────────────────────────────────────────────
    defineField({ name: "title", title: "Title", type: "string", group: "core" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the project page URL, e.g. /projects/rainbow-bridge.",
      components: { input: AutoSlugInput },
      group: "core",
    }),
    defineField({
      name: "year",
      title: "Year (of creation)",
      type: "number",
      group: "core",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      group: "core",
    }),
    defineField({
      name: "placement",
      title: "Touring / Permanent / Exhibition",
      type: "string",
      description:
        "Permanent/Exhibition = one fixed site. Touring = multiple stops over time, tracked via Locations below. (Exhibition replaces the old \"Temporary\" label.)",
      options: {
        list: [
          { title: "Permanent", value: "permanent" },
          { title: "Exhibition", value: "exhibition" },
          { title: "Touring", value: "touring" },
        ],
        layout: "radio",
      },
      group: "core",
    }),
    defineField({
      name: "city",
      title: "Location",
      type: "string",
      description: 'City / region shown on cards and in the hero, e.g. "Jackson, TN".',
      hidden: ({ document }) =>
        document?.placement !== "permanent" && document?.placement !== "exhibition",
      group: "core",
    }),

    // ── Project page ──────────────────────────────────────────────────────────
    // Rendered on /projects/[slug].
    defineField({ name: "description", title: "Description", type: "text", group: "page" }),
    defineField({
      name: "footprint",
      title: "Footprint",
      type: "string",
      description: 'Physical size, e.g. "75ft x 30ft x 4ft".',
      group: "page",
    }),
    defineField({
      name: "typology",
      title: "Typology",
      type: "string",
      description: 'Short type/category tag, e.g. "Walkable, LEDs".',
      group: "page",
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
      group: "page",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      description: "Optional pull quote shown alongside the description.",
      group: "page",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description:
        "Optional — add up to 3 content breaks (image + title + body) for best results; no hard limit. Each section needs all three fields once added.",
      group: "page",
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
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      description:
        "Photo dump for the project page — drop in multiple files at once, just like the media library. Drag to reorder. Full width vs grid layout is picked automatically from each photo's aspect ratio (landscape → full width, square/portrait → grid).",
      group: "page",
    }),
    defineField({
      name: "crew",
      title: "Crew",
      type: "array",
      of: [{ type: "string" }],
      description: "Names only, one per entry.",
      group: "page",
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
      group: "page",
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Materials used in this work. Also drives the Materials filter on the Projects page. Free-text tags — the filter matches case-insensitively, so reuse existing wording (e.g. \"Steel\", not \"steel\") where it applies, but new tags are always fine to add.",
      options: { layout: "tags" },
      group: "page",
    }),

    // ── Filters ───────────────────────────────────────────────────────────────
    defineField({
      name: "interactive",
      title: "Interactive",
      type: "boolean",
      description: "Enables the Interactive filter on the Projects page.",
      initialValue: false,
      group: "filters",
    }),
  ],
});
