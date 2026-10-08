// One-time import: copy project descriptions from the old Wix site
// (lookingup.art) into the Sanity `description` field.
//
// Maps Sanity slugs to old-site pages (see SOURCES). Projects that already
// have a description are skipped unless `--overwrite` is passed.
//
// Usage:
//
//   node --env-file=.env.local scripts/import-descriptions.mjs dry-run
//   node --env-file=.env.local scripts/import-descriptions.mjs run
//   node --env-file=.env.local scripts/import-descriptions.mjs run --overwrite
//
// `dry-run` prints every match and the text that would be written.

import { createClient } from "@sanity/client";

const SITE = "https://www.lookingup.art";

// Sanity slug -> old-site page + which rich-text blocks (1-based, in page
// order) hold the description. Layouts differ per page, so this is curated.
const SOURCES = {
  "cone-down": { path: "/Projects/cone-down", blocks: [2] },
  "phoenicopterus-rex": { path: "/Projects/phoenicopterus-rex", blocks: [2] },
  sirsasana: { path: "/sirsasana", blocks: [4] },
  "over-ruled": { path: "/over-ruled", blocks: [3] },
  namaskaram: { path: "/namaskaram", blocks: [2] },
  "arbor-lights": { path: "/arbor-lights", blocks: [2] },
  "wabash-lights": { path: "/the-wabash-lights", blocks: [2], strip: /^The Wabash Lights\s*/ },
  "icecream-dj-booth": { path: "/ice-cream-dj", blocks: [2, 3] },
  "radia-aurelia": { path: "/radia-aurelia", blocks: [2] },
  "rainbow-bridge": { path: "/Projects/rainbow-bridge", blocks: [2] },
};

const mode = process.argv[2];
const overwrite = process.argv.includes("--overwrite");
if (mode !== "dry-run" && mode !== "run") {
  console.error("Usage: import-descriptions.mjs <dry-run|run> [--overwrite]");
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
if (mode === "run" && !token) throw new Error("Missing SANITY_API_TOKEN (needs write access).");

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/​/g, "");

function extract(html, { blocks, strip }) {
  const parts = html.split('data-testid="richTextElement"');
  const paras = blocks.map((n) => {
    const seg = (parts[n] ?? "").split(/<div[^>]*wixui-rich-text/)[0];
    const text = [...seg.matchAll(/<(?:p|h\d)\b[^>]*>([\s\S]*?)<\/(?:p|h\d)>/g)]
      .map((m) => m[1].replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, ""))
      .join(" ");
    return decode(text)
      .replace(/#comp-[^{]*\{[^}]*\}/g, "")
      .replace(/\s+/g, " ")
      .trim();
  });
  let out = paras.filter(Boolean).join("\n\n");
  if (strip) out = out.replace(strip, "");
  return out;
}

const projects = await client.fetch(
  `*[_type == "project"]{_id, title, "slug": slug.current, description}`
);

let written = 0;
for (const p of projects) {
  const src = SOURCES[p.slug];
  if (!src) {
    console.log(`? "${p.title}": no source on old site`);
    continue;
  }
  if (p.description && !overwrite) {
    console.log(`= "${p.title}": already has a description, skipping`);
    continue;
  }
  const description = extract(await (await fetch(SITE + src.path)).text(), src);
  if (!description) {
    console.log(`– "${p.title}": nothing extracted from ${src.path}`);
    continue;
  }
  console.log(`✓ "${p.title}"\n    ${description.replace(/\n+/g, " ")}`);
  if (mode === "run") {
    await client.patch(p._id).set({ description }).commit();
    written++;
  }
}
console.log(mode === "run" ? `\nWrote ${written} descriptions.` : "\nDry run — nothing written.");
