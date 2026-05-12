import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { media } from 'sanity-plugin-media';
import { StructureBuilder } from "sanity/structure";

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
            S.documentTypeListItem("artwork").title("Artworks"),
            // add other types here as needed
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "artwork"
            ),
          ]),
    }),
    visionTool(),
    media(),
  ],

  schema: { types: schemaTypes },
});