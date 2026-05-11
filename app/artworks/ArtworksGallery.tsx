"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterBar from "./FilterBar";
import ArtworkGrid from "./ArtworkGrid";
import type { ArtworkIndex } from "../../sanity/lib/queries";

type Props = { artworks: ArtworkIndex[] };

function applyFilters(artworks: ArtworkIndex[], params: URLSearchParams): ArtworkIndex[] {
  let result = artworks;

  if (params.get("interactive") === "true") {
    result = result.filter((a) => a.interactive);
  }

  const type = params.get("type");
  if (type === "touring" || type === "permanent") {
    result = result.filter((a) => a.type === type);
  }

  const city = params.get("city");
  if (city) {
    result = result.filter((a) => a.city?.toLowerCase() === city);
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
    <div className="max-w-6xl mx-auto px-8 pt-32 pb-16">
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
