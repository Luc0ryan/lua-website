"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Artwork } from "../../sanity/lib/queries";

type Props = {
  artworks: Artwork[]; // unfiltered, used for city counts
};

// ── Chip ──────────────────────────────────────────────────────────────────────

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-4 py-1.5 text-sm font-body border-2 transition-shadow cursor-pointer whitespace-nowrap",
        selected
          ? "border-pink shadow-[3px_3px_0_0_#DC738F]"
          : "border-fg hover:shadow-[3px_3px_0_0_#111111]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ── City helpers ──────────────────────────────────────────────────────────────

function getCityCounts(artworks: Artwork[]) {
  const counts = new Map<string, number>();
  for (const a of artworks) {
    if (a.city && a.placement !== "touring") {
      counts.set(a.city, (counts.get(a.city) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => a.city.localeCompare(b.city));
}

// City is stored lowercase in the URL; this finds the display-case label.
function findCityLabel(artworks: Artwork[], slug: string) {
  return artworks.find((a) => a.city?.toLowerCase() === slug)?.city ?? slug;
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

export default function FilterBar({ artworks }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const interactive = searchParams.get("interactive") === "true";
  const placement = searchParams.get("placement") as "touring" | "permanent" | null;
  const citySlug = searchParams.get("city"); // lowercase slug

  const [locationOpen, setLocationOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      value === null ? params.delete(key) : params.set(key, value);
      const qs = params.toString();
      router.replace(pathname + (qs ? `?${qs}` : ""));
    },
    [router, pathname, searchParams]
  );

  const allCities = getCityCounts(artworks);
  const filteredCities = citySearch
    ? allCities.filter((c) => c.city.toLowerCase().includes(citySearch.toLowerCase()))
    : allCities;

  const cityLabel = citySlug ? findCityLabel(artworks, citySlug) : null;
  const locationSelected = citySlug !== null;

  return (
    <div className="mb-10">
      <p className="text-[10px] font-body tracking-widest uppercase text-fg/50 mb-4">SHOW</p>

      <div className="flex flex-wrap items-center gap-2">
        {/* Interactive toggle */}
        <Chip
          label="Interactive"
          selected={interactive}
          onClick={() => setParam("interactive", interactive ? null : "true")}
        />

        {/* Touring / Permanent — 32px gap on desktop, flows in-line on mobile */}
        <div className="flex gap-2 ml-0 sm:ml-8">
          <Chip
            label="Touring"
            selected={placement === "touring"}
            onClick={() => setParam("placement", placement === "touring" ? null : "touring")}
          />
          <Chip
            label="Permanent"
            selected={placement === "permanent"}
            onClick={() => setParam("placement", placement === "permanent" ? null : "permanent")}
          />
        </div>

        {/* Location — 32px gap on desktop, flows in-line on mobile */}
        <div className="relative ml-0 sm:ml-8" ref={popoverRef}>
          {/* The chip is a border wrapper so × sits inside the border */}
          <div
            className={[
              "flex items-center border-2 transition-shadow",
              locationSelected
                ? "border-pink shadow-[3px_3px_0_0_#DC738F]"
                : "border-fg hover:shadow-[3px_3px_0_0_#111111]",
            ].join(" ")}
          >
            <button
              onClick={() => setLocationOpen((o) => !o)}
              className="px-4 py-1.5 text-sm font-body cursor-pointer whitespace-nowrap"
            >
              {cityLabel ? `Location: ${cityLabel}` : "Location ▾"}
            </button>
            {cityLabel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setParam("city", null);
                  setLocationOpen(false);
                  setCitySearch("");
                }}
                aria-label="Clear location filter"
                className="pr-3 text-base leading-none cursor-pointer text-fg/60 hover:text-fg"
              >
                ×
              </button>
            )}
          </div>

          {/* Popover */}
          {locationOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-bg border-2 border-fg shadow-[3px_3px_0_0_#111111] z-50">
              <div className="p-2 border-b border-fg/20">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search cities…"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full text-sm font-body bg-transparent outline-none px-2 py-1 border border-fg/30 focus:border-fg"
                />
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {filteredCities.length === 0 && (
                  <li className="px-4 py-2 text-sm font-body text-fg/50">No cities found</li>
                )}
                {filteredCities.map(({ city, count }) => {
                  const slug = city.toLowerCase();
                  const active = citySlug === slug;
                  return (
                    <li key={city}>
                      <button
                        onClick={() => {
                          setParam("city", slug);
                          setLocationOpen(false);
                          setCitySearch("");
                        }}
                        className={[
                          "w-full text-left px-4 py-2 text-sm font-body flex justify-between items-center cursor-pointer hover:bg-fg/5",
                          active ? "text-pink" : "text-fg",
                        ].join(" ")}
                      >
                        <span>{city}</span>
                        <span className="text-fg/40 tabular-nums">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
