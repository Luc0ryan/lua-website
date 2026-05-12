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
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 3,
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
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Pin this post to appear first in the grid",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
      date: "publishedAt",
    },
    prepare({ title, media, date }: { title?: string; media?: unknown; date?: string }) {
      return {
        title: title?.slice(0, 60) ?? "No caption",
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
