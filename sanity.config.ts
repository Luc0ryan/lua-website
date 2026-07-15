import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { googleMapsInput } from "@sanity/google-maps-input";
import { schemaTypes } from "./sanity/schemas";
import { media } from 'sanity-plugin-media';
import { StructureBuilder } from "sanity/structure";
import {
  AddLocationAction,
  ResolveToPermanentAction,
  wrapPublishForLocationAutoSwap,
} from "./sanity/actions/documentActions";

export default defineConfig({
  name: "default",
  title: "LUA Studio",
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("location").title("Locations"),
            S.divider(),
            S.listItem()
              .id("homepage")
              .title("Homepage")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
              ),
            S.listItem()
              .id("siteSettings")
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            // add other types here as needed
            ...S.documentTypeListItems().filter(
              (item) => !["project", "location", "homepage", "siteSettings"].includes(item.getId() ?? "")
            ),
          ]),
    }),
    visionTool(),
    media(),
    googleMapsInput({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "" }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: "location-for-project",
        title: "Location (for this project)",
        schemaType: "location",
        parameters: [{ name: "projectId", type: "string" }],
        value: (params: { projectId: string }) => ({
          project: { _type: "reference", _ref: params.projectId },
        }),
      },
    ],
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === "project") {
        return [...prev, AddLocationAction, ResolveToPermanentAction];
      }
      if (context.schemaType === "location") {
        return prev.map((action) =>
          action.action === "publish" ? wrapPublishForLocationAutoSwap(action) : action
        );
      }
      return prev;
    },
  },
});