import { defineField, defineType } from "sanity";

export const staffMemberSchema = defineType({
  name: "staffMember",
  title: "Staff Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Position in the team list (lower = first). Falls back to creation date if unset.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }] },
  ],
  preview: {
    select: { name: "name", role: "role", media: "photo" },
    prepare: ({ name, role, media }) => ({
      title: name || "Untitled",
      subtitle: role,
      media,
    }),
  },
});
