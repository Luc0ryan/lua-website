import { Suspense } from "react";
import ArtworksGallery from "./ArtworksGallery";
import ArtworkGrid from "./ArtworkGrid";
import { getArtworksIndex, type Artwork } from "@/sanity/lib/queries";
import { Heading } from "@/app/components/ui/Heading";

export const metadata = {
  title: "Projects — Looking Up Arts",
  description:
    "Browse Looking Up Arts' permanent, exhibition and touring interactive artworks.",
};

// What the server sends before JavaScript runs. ArtworksGallery reads the
// filters from the URL with useSearchParams(), so Next can't render it on the
// server; without this fallback the page HTML had no projects in it at all.
// Matches ArtworksGallery's layout so nothing jumps when it takes over.
function UnfilteredGallery({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-gutter pt-8 pb-16">
      <Heading level="h1" className="uppercase mb-8">All Projects</Heading>
      {/* Reserves the filter bar's height until it loads */}
      <div className="mb-10 h-10" aria-hidden="true" />
      <ArtworkGrid artworks={artworks} />
    </div>
  );
}

export default async function ProjectsPage() {
  const artworks = await getArtworksIndex().catch(() => []);

  return (
    <Suspense fallback={<UnfilteredGallery artworks={artworks} />}>
      <ArtworksGallery artworks={artworks} />
    </Suspense>
  );
}
