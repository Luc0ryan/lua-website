// Literal `process.env.NEXT_PUBLIC_*` access so Next can inline these into the
// client bundle. A missing project ID fails loudly instead of silently
// querying a placeholder project.
const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!id) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local (see .env.example)."
  );
}

export const projectId: string = id;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
