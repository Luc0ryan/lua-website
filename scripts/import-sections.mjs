// One-time import: build project `sections` (image + title + body) from the
// full word-for-word copy on the old Wix site (lookingup.art), uploading the
// matching photos from there.
//
// Usage (pass the slug; sections are defined per-project in PLANS below):
//
//   node --env-file=.env.local scripts/import-sections.mjs wabash-lights dry-run
//   node --env-file=.env.local scripts/import-sections.mjs wabash-lights run
//
// Replaces any existing `sections` on the project. `description` is left alone.

import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const SITE = "https://www.lookingup.art";
const MEDIA = "https://static.wixstatic.com/media";

// blocks: 1-based rich-text blocks on the old page (page order).
// heading: set when the block's first paragraph is a heading that becomes the
//          section title (it is dropped from the body).
// image: Wix media filename for the section photo.
const PLANS = {
  "wabash-lights": {
    path: "/the-wabash-lights",
    sections: [
      { title: "The Build", blocks: [3], image: "997167_71c34b09d28b4cbdbeaab2cf63070911~mv2.jpg" },
      { title: "The Interaction", blocks: [4, 5], heading: true, image: "997167_809cc44b18a9454b8d8e6651c644276e~mv2.jpg" },
      { title: "Vision for the Future", blocks: [6], heading: true, image: "997167_7eb4c33e9c7c4bf99341de34650460e6~mv2.jpg" },
    ],
  },
};

const [slug, mode] = process.argv.slice(2);
const plan = PLANS[slug];
if (!plan || (mode !== "dry-run" && mode !== "run")) {
  console.error(`Usage: import-sections.mjs <${Object.keys(PLANS).join("|")}> <dry-run|run>`);
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
    .replace(/&rsquo;|&lsquo;/g, "’")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/​/g, "");

const clean = (s) => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ");

// One <p> -> Sanity block, turning <a href> into link annotations.
function toBlock(pHtml) {
  const markDefs = [];
  const children = [];
  let last = 0;
  const push = (text, marks = []) => text && children.push({ _type: "span", _key: randomUUID().slice(0, 8), text, marks });
  for (const m of pHtml.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    push(clean(pHtml.slice(last, m.index)));
    const key = randomUUID().slice(0, 8);
    markDefs.push({ _type: "link", _key: key, href: decode(m[1]) });
    push(clean(m[2]), [key]);
    last = m.index + m[0].length;
  }
  push(clean(pHtml.slice(last)));
  // Collapse stray whitespace at paragraph edges.
  if (children.length) {
    children[0].text = children[0].text.trimStart();
    children[children.length - 1].text = children[children.length - 1].text.trimEnd();
  }
  const text = children.map((c) => c.text).join("").trim();
  return text ? { _type: "block", _key: randomUUID().slice(0, 8), style: "normal", markDefs, children } : null;
}

function bodyFor(parts, { blocks, heading }) {
  const out = [];
  for (const n of blocks) {
    const seg = (parts[n] ?? "").split(/<div[^>]*wixui-rich-text/)[0].replace(/<style[\s\S]*?<\/style>/g, "");
    const ps = [...seg.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => toBlock(m[1])).filter(Boolean);
    out.push(...ps);
  }
  if (heading) out.shift();
  return out;
}

const html = await (await fetch(SITE + plan.path)).text();
const parts = html.split('data-testid="richTextElement"');

const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id, title}`, { slug });
if (!doc) throw new Error(`No Sanity project with slug "${slug}".`);

const sections = [];
for (const s of plan.sections) {
  const body = bodyFor(parts, s);
  console.log(`\n## ${s.title}  [image: ${s.image}]`);
  for (const b of body) console.log(`  ¶ ${b.children.map((c) => (c.marks.length ? `[${c.text}](link)` : c.text)).join("")}`);

  let image;
  if (mode === "run") {
    const buf = Buffer.from(await (await fetch(`${MEDIA}/${s.image}`)).arrayBuffer());
    const asset = await client.assets.upload("image", buf, { filename: s.image.replace("~mv2", "") });
    image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  }
  sections.push({ _type: "projectSection", _key: randomUUID().slice(0, 8), title: s.title, body, ...(image && { image }) });
}

if (mode === "run") {
  await client.patch(doc._id).set({ sections }).commit();
  console.log(`\nWrote ${sections.length} sections to "${doc.title}".`);
} else {
  console.log("\nDry run — nothing written.");
}
