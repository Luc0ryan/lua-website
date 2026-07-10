import { defineField, defineType } from "sanity";

export const homepageSchema = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroProjects",
      title: "Hero (accordion banner)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "artwork" }] }],
      description: "Projects shown in the homepage hero accordion, in order.",
    }),
    defineField({
      name: "touringProjects",
      title: "Touring (featured)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "artwork" }] }],
      description: "Projects shown in the homepage Touring section, in order. Only the first 3 display.",
      validation: (Rule) => Rule.max(3).warning("Only the first 3 will display."),
    }),
    defineField({
      name: "commissionProjects",
      title: "Commission (featured)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "artwork" }] }],
      description: "Projects shown in the homepage Commission section, in order. Only the first 3 display.",
      validation: (Rule) => Rule.max(3).warning("Only the first 3 will display."),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
