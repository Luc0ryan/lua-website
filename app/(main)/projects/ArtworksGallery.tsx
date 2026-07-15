"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterBar from "./FilterBar";
import ArtworkGrid from "./ArtworkGrid";
import type { Artwork } from "@/sanity/lib/queries";

type Props = { artworks: Artwork[] };

function applyFilters(artworks: Artwork[], params: URLSearchParams): Artwork[] {
  let result = artworks;

  const q = params.get("q");
  if (q) {
    const lower = q.toLowerCase();
    result = result.filter((a) => a.title.toLowerCase().includes(lower));
  }

  if (params.get("interactive") === "true") {
    result = result.filter((a) => a.interactive);
  }

  const placement = params.get("placement");
  if (placement === "touring" || placement === "permanent" || placement === "exhibition") {
    result = result.filter((a) => a.placement === placement);
  }

  const city = params.get("city");
  if (city) {
    result = result.filter((a) => a.city?.toLowerCase() === city);
  }

  const material = params.get("material");
  if (material) {
    result = result.filter((a) =>
      a.materials?.some((m) => m.trim().toLowerCase() === material)
    );
  }

  return result;
}

export default function ArtworksGallery({ artworks }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filtered = applyFilters(artworks, searchParams);
  const hasFilters = searchParams.toString() !== "";

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-gutter pt-8 pb-16">
      <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase mb-8">All Projects</h1>
      <FilterBar artworks={artworks} />

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm font-body text-fg/50">No artworks match these filters.</p>
          {hasFilters && (
            <button
              onClick={() => router.replace(pathname)}
              className="mt-3 text-sm font-body text-fg underline underline-offset-2 cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ArtworkGrid artworks={filtered} />
      )}
    </div>
  );
}
