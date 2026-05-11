"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { buildRows } from "./buildRows";
import FilterBar from "./FilterBar";
import ArtworksGrid from "./ArtworksGrid";
import type { ArtworkIndexItem } from "../../sanity/lib/queries";

type Props = { artworks: ArtworkIndexItem[] };

export default function ArtworksGallery({ artworks }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const interactive = searchParams.get("interactive") === "true";
  const type = searchParams.get("type") as "touring" | "permanent" | null;
  const city = searchParams.get("city");

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      if (interactive && !a.interactive) return false;
      if (type && a.type !== type) return false;
      if (city && a.city !== city) return false;
      return true;
    });
  }, [artworks, interactive, type, city]);

  const rows = useMemo(() => buildRows(filtered), [filtered]);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?", { scroll: false });
    },
    [searchParams, router]
  );

  const clearAll = useCallback(() => router.push("?", { scroll: false }), [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-16">
      <FilterBar
        artworks={artworks}
        interactive={interactive}
        type={type}
        city={city}
        setParam={setParam}
      />

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm font-body text-fg/60">No artworks match these filters.</p>
          <button
            onClick={clearAll}
            className="mt-3 text-sm font-body text-fg underline underline-offset-2 hover:text-fg/60 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ArtworksGrid rows={rows} />
      )}
    </div>
  );
}
