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
  ],
  preview: {
    select: {
      title: "alt",
      media: "image",
    },
    prepare({ title, media }: { title?: string; media?: unknown }) {
      return {
        title: title?.slice(0, 60) ?? "No alt text",
        media,
      };
    },
  },
});
