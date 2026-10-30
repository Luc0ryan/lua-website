import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/sanity/lib/queries";

// Sitemaps are cached forever by default (built once at deploy). This one
// refreshes on the same interval as every Sanity query (see sanityFetch), so
// newly published projects show up without a redeploy.

const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const staticPaths = ["", "/projects", "/commission", "/about", "/map", "/donate", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectSlugs().catch(() => []);
  return [
    ...staticPaths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...projects.map(({ slug, updatedAt }) => ({
      url: `${siteUrl}/projects/${slug}`,
      lastModified: updatedAt,
    })),
  ];
}
