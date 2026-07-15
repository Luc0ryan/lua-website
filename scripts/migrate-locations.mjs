// One-time migration: convert each project's freeform `touringLocations`
// array into standalone `location` documents (see sanity/schemas/location.ts).
//
// Must run AFTER migrate-project-rename.mjs (this queries `_type == "project"`).
//
// For each stop: city = the freeform string as-is (venueName left blank —
// no reliable venue/city split from freeform text like "Austin, TX"), year
// copied over, geopoint left unset for an editor to geocode via the Google
// Maps search input in Studio. The latest stop by year (ties broken by
// later array position) becomes locationState "current"; all others become
// "past".
//
// touringLocations itself is left alone — it's deprecated/read-only on the
// project schema, not deleted. Re-running this script after a successful
// `run` will create duplicate location documents, so check `dry-run` first
// and only run `run` once per project.
//
// Usage (run with --env-file so NEXT_PUBLIC_SANITY_* and SANITY_API_TOKEN
// load from .env.local automatically):
//
//   node --env-file=.env.local scripts/migrate-locations.mjs dry-run
//   node --env-file=.env.local scripts/migrate-locations.mjs run

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

async function fetchProjectsWithTouring() {
  return client.fetch(
    `*[_type == "project" && count(touringLocations) > 0]{ _id, title, touringLocations }`
  );
}

// Latest year wins; ties broken by later array position (mirrors how the
// old freeform data tended to be entered — later entries are more recent).
function pickCurrentIndex(stops) {
  let bestIndex = 0;
  for (let i = 1; i < stops.length; i++) {
    if ((stops[i].year ?? -Infinity) >= (stops[bestIndex].year ?? -Infinity)) {
      bestIndex = i;
    }
  }
  return bestIndex;
}

function toLocationDocs(project) {
  const stops = project.touringLocations ?? [];
  const currentIndex = pickCurrentIndex(stops);
  return stops.map((stop, i) => ({
    _type: "location",
    project: { _type: "reference", _ref: project._id },
    city: stop.location,
    year: stop.year,
    locationState: i === currentIndex ? "current" : "past",
  }));
}

async function dryRun() {
  const projects = await fetchProjectsWithTouring();
  console.log(`Found ${projects.length} project(s) with touring stops to migrate.\n`);
  for (const project of projects) {
    const docs = toLocationDocs(project);
    console.log(`  "${project.title ?? project._id}" — ${docs.length} stop(s):`);
    for (const doc of docs) {
      console.log(`    ${doc.city ?? "(no city)"} · ${doc.year ?? "no year"} · ${doc.locationState}`);
    }
  }
  console.log("\nNo changes written. Run with `run` to apply.");
}

async function run() {
  const projects = await fetchProjectsWithTouring();
  console.log(`Creating location documents for ${projects.length} project(s)...`);

  const tx = client.transaction();
  let count = 0;
  for (const project of projects) {
    for (const doc of toLocationDocs(project)) {
      tx.create(doc);
      count++;
    }
  }
  await tx.commit();

  console.log(
    `Done. Created ${count} location document(s). touringLocations left untouched (deprecated, read-only) for historical reference.`
  );
}

const command = process.argv[2];
if (command === "dry-run") {
  await dryRun();
} else if (command === "run") {
  await run();
} else {
  console.error("Usage: node --env-file=.env.local scripts/migrate-locations.mjs <dry-run|run>");
  process.exit(1);
}
