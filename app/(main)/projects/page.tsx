import { Suspense } from "react";
import ArtworksGallery from "./ArtworksGallery";
import { getArtworksIndex } from "@/sanity/lib/queries";

export const metadata = {
  title: "Projects — Looking Up Arts",
  description:
    "Browse Looking Up Arts' permanent, exhibition and touring interactive artworks.",
};

export default async function ProjectsPage() {
  const artworks = await getArtworksIndex().catch(() => []);

  return (
    <Suspense>
      <ArtworksGallery artworks={artworks} />
    </Suspense>
  );
}
