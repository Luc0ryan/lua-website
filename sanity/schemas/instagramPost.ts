import { defineField, defineType } from "sanity";

export const instagramPostSchema = defineType({
  name: "instagramPost",
  title: "Instagram Post",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Describe the image for screen readers",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "postUrl",
      title: "Instagram Post URL",
      type: "url",
      description: "Link to the original Instagram post",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
  ],
  preview: {
    select: {
      title: "alt",
      media: "image",
      date: "publishedAt",
    },
    prepare({ title, media, date }: { title?: string; media?: unknown; date?: string }) {
      return {
        title: title?.slice(0, 60) ?? "No alt text",
        subtitle: date ? new Date(date).toLocaleDateString() : "",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" as const }],
    },
  ],
});
