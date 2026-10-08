import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/sanity/lib/queries";

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
