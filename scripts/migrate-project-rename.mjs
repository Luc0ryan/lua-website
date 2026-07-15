// One-time migration: rename `artwork` documents to `project`, and rename
// the placement value "temporary" to "exhibition" (Exhibition replaces the
// old Temporary label — see AGENTS.md "Design Conventions").
//
// IMPORTANT: this rewrites every artwork document's `_type` in place, at the
// same `_id`, using createOrReplace — existing references (homepage lists,
// etc.) keep resolving with no further patching needed. Must run AFTER the
// new project/location schema is deployed, so Studio recognizes "project".
// Run migrate-locations.mjs after this one.
//
// Usage (run with --env-file so NEXT_PUBLIC_SANITY_* and SANITY_API_TOKEN
// load from .env.local automatically):
//
//   node --env-file=.env.local scripts/migrate-project-rename.mjs dry-run
//   node --env-file=.env.local scripts/migrate-project-rename.mjs run
//
// `dry-run` fetches every artwork document and prints what would change,
// without writing anything. Always run this first.
//
// `run` performs the actual createOrReplace for every artwork document.

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_TOKEN. Create a write-scoped token at https://sanity.io/manage and add it to .env.local."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function fetchArtworks() {
  return client.fetch(`*[_type == "artwork"]`);
}

function toProjectDoc(doc) {
  return {
    ...doc,
    _type: "project",
    placement: doc.placement === "temporary" ? "exhibition" : doc.placement,
  };
}

async function dryRun() {
  const artworks = await fetchArtworks();
  console.log(`Found ${artworks.length} artwork document(s) to migrate.\n`);
  for (const doc of artworks) {
    const next = toProjectDoc(doc);
    const placementNote =
      doc.placement !== next.placement ? ` (placement: "${doc.placement}" → "${next.placement}")` : "";
    console.log(`  ${doc._id}  "${doc.title ?? "Untitled"}"${placementNote}`);
  }
  console.log("\nNo changes written. Run with `run` to apply.");
}

async function run() {
  const artworks = await fetchArtworks();
  console.log(`Migrating ${artworks.length} artwork document(s) to _type "project"...`);
  for (const doc of artworks) {
    await client.createOrReplace(toProjectDoc(doc));
  }
  console.log(
    "Done. Each artwork document was replaced in place as a project document with the same _id — all existing references still resolve."
  );
}

const command = process.argv[2];
if (command === "dry-run") {
  await dryRun();
} else if (command === "run") {
  await run();
} else {
  console.error("Usage: node --env-file=.env.local scripts/migrate-project-rename.mjs <dry-run|run>");
  process.exit(1);
}
