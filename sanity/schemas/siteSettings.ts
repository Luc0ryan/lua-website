import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "uppercaseTitles",
      title: "Uppercase project titles",
      type: "boolean",
      description:
        "When on, project titles render in ALL CAPS across the site. Turn off to show each title exactly as typed.",
      initialValue: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
