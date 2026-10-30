import { createClient, type QueryParams } from "@sanity/client";
import { projectId, dataset } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

/** How often (seconds) cached pages re-check Sanity for edits. */
export const SANITY_REVALIDATE = 60;

/**
 * Use this instead of `client.fetch` in site code. Every query states its own
 * refresh interval, so a page's freshness never depends on some other fetch
 * elsewhere in the tree happening to set one.
 */
export function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  revalidate: number = SANITY_REVALIDATE
): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate } });
}
