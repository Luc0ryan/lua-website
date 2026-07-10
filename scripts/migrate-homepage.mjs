// One-time migration for the artwork -> homepage schema split.
//
// Usage (run with --env-file so NEXT_PUBLIC_SANITY_* and SANITY_API_TOKEN load
// from .env.local automatically):
//
//   node --env-file=.env.local scripts/migrate-homepage.mjs populate
//   node --env-file=.env.local scripts/migrate-homepage.mjs cleanup
//
// `populate` reads every artwork with a `role` set and copies it into the new
// singleton `homepage` document's reference lists. Safe to re-run.
//
// `cleanup` removes the old role/heroOrder/touringOrder/commissionOrder fields
// from every artwork. Only run this after confirming the Homepage document in
// Studio looks right — there's no undo besides Sanity's document history.

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

function toReferences(artworks) {
  return artworks.map((a) => ({ _type: "reference", _ref: a._id, _key: a._id }));
}

async function populate() {
  const artworks = await client.fetch(
    `*[_type == "artwork" && defined(role)]{ _id, role, heroOrder, touringOrder, commissionOrder }`
  );

  const hero = artworks
    .filter((a) => a.role === "hero")
    .sort((a, b) => (a.heroOrder ?? 0) - (b.heroOrder ?? 0));
  const touring = artworks
    .filter((a) => a.role === "touring")
    .sort((a, b) => (a.touringOrder ?? 0) - (b.touringOrder ?? 0));
  const commission = artworks
    .filter((a) => a.role === "commission")
    .sort((a, b) => (a.commissionOrder ?? 0) - (b.commissionOrder ?? 0));

  console.log(
    `Found ${hero.length} hero, ${touring.length} touring, ${commission.length} commission project(s).`
  );

  await client
    .createIfNotExists({ _id: "homepage", _type: "homepage" })
    .then(() =>
      client
        .patch("homepage")
        .set({
          heroProjects: toReferences(hero),
          touringProjects: toReferences(touring),
          commissionProjects: toReferences(commission),
        })
        .commit()
    );

  console.log("Homepage document populated. Review it in Studio before running `cleanup`.");
}

async function cleanup() {
  const artworks = await client.fetch(`*[_type == "artwork" && defined(role)]{ _id }`);
  console.log(`Unsetting role fields on ${artworks.length} artwork document(s)...`);

  const tx = client.transaction();
  for (const a of artworks) {
    tx.patch(a._id, {
      unset: ["role", "heroOrder", "touringOrder", "commissionOrder"],
    });
  }
  await tx.commit();

  console.log("Cleanup complete.");
}

const command = process.argv[2];
if (command === "populate") {
  await populate();
} else if (command === "cleanup") {
  await cleanup();
} else {
  console.error("Usage: node --env-file=.env.local scripts/migrate-homepage.mjs <populate|cleanup>");
  process.exit(1);
}
