import { defineField, defineType } from "sanity";

export const locationSchema = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venueName",
      title: "Venue name",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      description: 'Enter as a 4-digit year, e.g. "2024".',
      validation: (Rule) => Rule.integer().min(1900).max(2100).error("Enter a 4-digit year, e.g. 2024."),
    }),
    defineField({
      name: "geopoint",
      title: "Location on map",
      type: "geopoint",
      description: "Search for the venue, then drag the pin to calibrate.",
    }),
    defineField({
      name: "locationState",
      title: "State",
      type: "string",
      description:
        "Setting this to Current automatically moves this project's previous current location (if any) to Past. Past only applies to touring projects; permanent and exhibition locations always show as Current.",
      options: {
        list: [
          { title: "Current", value: "current" },
          { title: "Past", value: "past" },
        ],
        layout: "radio",
      },
      initialValue: "current",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      venueName: "venueName",
      city: "city",
      projectTitle: "project.title",
      locationState: "locationState",
    },
    prepare: ({ venueName, city, projectTitle, locationState }) => ({
      title: venueName || city || "Untitled location",
      subtitle: [projectTitle, locationState].filter(Boolean).join(" · "),
    }),
  },
});
