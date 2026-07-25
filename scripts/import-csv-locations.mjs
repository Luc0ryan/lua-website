// One-time import: adds locations from the "lua_locations_clean" CSV (2026-07-24).
//
// Two groups of data, hardcoded below (not parsed from the CSV at runtime —
// several rows needed hand judgment about what to skip, see comments):
//
//   EXISTING_PROJECT_LOCATIONS — rows whose project already exists in Sanity.
//     Created as PUBLISHED `location` docs, referencing the published project,
//     so they show up on /map immediately.
//
//   NEW_PROJECTS — CSV project names with no matching Sanity project yet.
//     Each gets a DRAFT `project` stub (title only) plus DRAFT `location` docs
//     referencing it. Everything stays invisible on the live map until an
//     editor reviews the stub in Studio (adds a slug/image/etc.) and publishes
//     both the project and its locations.
//
// Rows skipped entirely (not present below): any row with blank lat/lng
// ("MISSING — need from Sri") and projects with zero location data in the
// CSV (Interlace, and the blank rows for Radia Celeste / Namaskaram, which
// already exist as projects).
//
// All imported locations default to locationState "past" — the CSV is
// historical tour-stop data with no signal about which stop (if any) is
// still current for a project. Multiple "past" locations per project is
// fine (no invariant to violate); multiple "current" would be wrong, so
// "past" is the safe default. Flip the right one to "current" per project
// in Studio afterward.
//
// Usage (run with --env-file so NEXT_PUBLIC_SANITY_* and SANITY_API_TOKEN
// load from .env.local automatically):
//
//   node --env-file=.env.local scripts/import-csv-locations.mjs dry-run
//   node --env-file=.env.local scripts/import-csv-locations.mjs run

import { randomUUID } from "crypto";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}

// Dry-run only needs read access (works without a token). `run` needs write
// access, checked just before it's used.
const readClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const EXISTING_PROJECT_LOCATIONS = [
  {
    projectTitle: "Phoenicopterus Rex",
    locations: [
      { venueName: "Black Rock City", city: "Black Rock City, NV", lat: 40.7864, lng: -119.2065 },
      { venueName: "Lyft Art Park", city: "Las Vegas, NV", lat: 36.169557, lng: -115.140229 },
      { venueName: "Container Park", city: "Las Vegas, NV", lat: 36.167778, lng: -115.137778 },
      { venueName: "Queen Mary", city: "Long Beach, CA", lat: 33.752111, lng: -118.189667 },
    ],
  },
  {
    projectTitle: "Rainbow Bridge",
    locations: [
      { venueName: "Black Rock City", city: "Black Rock City, NV", lat: 40.7864, lng: -119.2065 },
      { venueName: "Art Basel Miami", city: "Miami Beach, FL", lat: 25.7907, lng: -80.13 },
      { venueName: "EDC Las Vegas", city: "Las Vegas, NV", lat: 36.2724, lng: -115.0111 },
      { venueName: "EDC Orlando", city: "Orlando, FL", lat: 28.5399, lng: -81.4025 },
      // Skipped: Blink Cincinnati, Liverpool, New York — no coordinates in CSV.
    ],
  },
  {
    projectTitle: "Arbor Lights",
    locations: [{ venueName: "Navy Pier", city: "Chicago, IL", lat: 41.891278, lng: -87.608722 }],
  },
  {
    projectTitle: "Radia Aurelia",
    locations: [{ venueName: "Anderson Park", city: "Jackson, TN", lat: 35.615377, lng: -88.821597 }],
  },
];

const NEW_PROJECTS = [
  {
    title: "Cone Down",
    locations: [{ venueName: "Black Rock City", city: "Black Rock City, NV", lat: 40.7864, lng: -119.2065 }],
    // Skipped: Los Angeles — no coordinates in CSV.
  },
  {
    title: "Pink Torch",
    locations: [
      { venueName: "Oakland City Hall (route start)", city: "Oakland, CA", lat: 37.80518, lng: -122.27258 },
      { venueName: "Twin Peaks (route end)", city: "San Francisco, CA", lat: 37.75235, lng: -122.44767 },
    ],
  },
  {
    title: "Wander Bloom",
    locations: [{ venueName: "EDC Las Vegas", city: "Las Vegas, NV", lat: 36.2724, lng: -115.0111 }],
  },
  {
    title: "Sirsasana",
    locations: [{ venueName: "Black Rock City", city: "Black Rock City, NV", lat: 40.7864, lng: -119.2065 }],
  },
  {
    title: "Icecream DJ Booth",
    locations: [{ venueName: "We All Scream", city: "Las Vegas, NV", lat: 36.168892, lng: -115.140113 }],
  },
  {
    title: "Navy Pier: Cubes",
    locations: [{ venueName: "Navy Pier", city: "Chicago, IL", lat: 41.891806, lng: -87.601444 }],
  },
  {
    title: "Navy Pier: Lamp",
    locations: [{ venueName: "Navy Pier", city: "Chicago, IL", lat: 41.891806, lng: -87.601444 }],
  },
  {
    title: "Wabash Lights",
    locations: [{ venueName: "Wabash Ave", city: "Chicago, IL", lat: 41.881304, lng: -87.625665 }],
  },
];

function toLocationDoc(projectRef, loc, { draft, weakProjectRef }) {
  const doc = {
    _type: "location",
    // `weakProjectRef` is set when the target project is itself a new draft
    // created in this same run: a strong ref to it would fail existence
    // validation (only "drafts.<id>" exists yet, not the bare id this points
    // at). Weak refs skip that check and resolve automatically once the
    // project stub is published under this same bare id.
    project: { _type: "reference", _ref: projectRef, ...(weakProjectRef ? { _weak: true } : {}) },
    venueName: loc.venueName,
    city: loc.city,
    geopoint: { _type: "geopoint", lat: loc.lat, lng: loc.lng },
    locationState: "past",
  };
  if (draft) doc._id = `drafts.${randomUUID()}`;
  return doc;
}

async function resolveExistingProjectIds() {
  const titles = EXISTING_PROJECT_LOCATIONS.map((p) => p.projectTitle);
  const projects = await readClient.fetch(`*[_type == "project" && title in $titles]{ _id, title }`, {
    titles,
  });
  const byTitle = new Map(projects.map((p) => [p.title, p._id]));
  const missing = titles.filter((t) => !byTitle.has(t));
  if (missing.length > 0) {
    console.error(`Expected these projects to already exist but couldn't find them: ${missing.join(", ")}`);
    process.exit(1);
  }
  return byTitle;
}

async function dryRun() {
  const byTitle = await resolveExistingProjectIds();
  console.log("Existing projects — locations to publish immediately:\n");
  let existingCount = 0;
  for (const group of EXISTING_PROJECT_LOCATIONS) {
    console.log(`  "${group.projectTitle}" (${byTitle.get(group.projectTitle)}) — ${group.locations.length} location(s):`);
    for (const loc of group.locations) {
      console.log(`    ${loc.venueName} · ${loc.city} · [${loc.lat}, ${loc.lng}]`);
      existingCount++;
    }
  }

  console.log("\nNew project stubs — created as drafts, with draft locations:\n");
  let newCount = 0;
  for (const project of NEW_PROJECTS) {
    console.log(`  "${project.title}" (new draft project) — ${project.locations.length} location(s):`);
    for (const loc of project.locations) {
      console.log(`    ${loc.venueName} · ${loc.city} · [${loc.lat}, ${loc.lng}]`);
      newCount++;
    }
  }

  console.log(
    `\nTotal: ${existingCount} published location(s) across ${EXISTING_PROJECT_LOCATIONS.length} existing project(s), ` +
      `${newCount} draft location(s) across ${NEW_PROJECTS.length} new draft project(s).`
  );
  console.log("No changes written. Run with `run` to apply.");
}

async function run() {
  if (!token) {
    console.error(
      "Missing SANITY_API_TOKEN. Create a write-scoped token at https://sanity.io/manage and add it to .env.local."
    );
    process.exit(1);
  }
  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  const byTitle = await resolveExistingProjectIds();

  const tx = writeClient.transaction();
  let publishedCount = 0;
  let draftCount = 0;

  for (const group of EXISTING_PROJECT_LOCATIONS) {
    const projectRef = byTitle.get(group.projectTitle);
    for (const loc of group.locations) {
      tx.create(toLocationDoc(projectRef, loc, { draft: false }));
      publishedCount++;
    }
  }

  for (const project of NEW_PROJECTS) {
    const projectId_ = randomUUID();
    tx.create({
      _id: `drafts.${projectId_}`,
      _type: "project",
      title: project.title,
    });
    draftCount++;
    for (const loc of project.locations) {
      tx.create(toLocationDoc(projectId_, loc, { draft: true, weakProjectRef: true }));
      draftCount++;
    }
  }

  await tx.commit();

  console.log(
    `Done. Created ${publishedCount} published location document(s) for existing projects, ` +
      `and ${draftCount} draft document(s) (new project stubs + their locations).`
  );
  console.log("Review and publish the draft project stubs in Studio when ready.");
}

const command = process.argv[2];
if (command === "dry-run") {
  await dryRun();
} else if (command === "run") {
  await run();
} else {
  console.error("Usage: node --env-file=.env.local scripts/import-csv-locations.mjs <dry-run|run>");
  process.exit(1);
}
