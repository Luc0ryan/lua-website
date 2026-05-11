import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { media } from 'sanity-plugin-media'

export default defineConfig({
  name: "default",
  title: "LUA Studio",
    basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [structureTool(), visionTool(), media()],
  
  schema: { types: schemaTypes },
  studio: {
    components: {
      // this is optional, just removes the "tool not found" state
    }
  }
})
