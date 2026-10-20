// Set one project's `description` in Sanity.
//
// Usage:
//
//   node --env-file=.env.local scripts/set-description.mjs list
//   node --env-file=.env.local scripts/set-description.mjs <slug> dry-run
//   node --env-file=.env.local scripts/set-description.mjs <slug> run
//
// Edit DESCRIPTIONS below to change the text. Writes to the published doc.

import { createClient } from "@sanity/client";

const DESCRIPTIONS = {
  // Replace the key with the real slug (run `list` to find it).
  jackson: `Inspired by Jackson's musical heritage, architecture, and agricultural roots, our installation celebrates the community's character through bold, playful designs. The work added a huge pop of color to the space, creating dramatic daytime shadows, shifting light shadows at night, and providing additional seating. Small table-and-chair clusters will encourage intimate social gatherings, while the large central sculpture will tie the entire area together, making the site feel like a cohesive, large-scale sculpture.

We developed laser-ready vector designs for each sculptural unit based on research into the Jackson Street Farmers Market's cultural context, site conditions, and public use, refining them through multiple review cycles to meet City of Jackson safety requirements.

The finalized designs were laser-cut from cold-rolled 11-gauge steel, with separate 3-gauge base plates fabricated for added structural strength. All components were welded, ground, and descaled before finishing.

Each lantern was hot-dip galvanized for long-term corrosion resistance, then chemically etched, primed, enamel-coated, and clear-coated to ensure durability and preserve the long-term visual integrity.`,
};

const [slug, mode] = process.argv.slice(2);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

if (slug === "list" || !slug) {
  const all = await client.fetch(`*[_type == "project"]|order(title){title, "slug": slug.current}`);
  for (const p of all) console.log(`${p.slug ?? "(no slug)"}\t${p.title}`);
  process.exit(0);
}

const description = DESCRIPTIONS[slug];
if (!description) throw new Error(`No text for "${slug}" in DESCRIPTIONS — add it (key = slug).`);
if (mode !== "dry-run" && mode !== "run") throw new Error("Second argument must be dry-run or run.");

const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id, title, description}`, { slug });
if (!doc) throw new Error(`No project with slug "${slug}".`);

console.log(`"${doc.title}" (${doc._id})`);
console.log(`Current: ${doc.description ? doc.description.slice(0, 80) + "…" : "(empty)"}`);
console.log(`New:     ${description.slice(0, 80)}…`);

if (mode === "run") {
  if (!token) throw new Error("Missing SANITY_API_TOKEN (needs write access).");
  await client.patch(doc._id).set({ description }).commit();
  console.log("Written.");
} else {
  console.log("Dry run — nothing written.");
}
