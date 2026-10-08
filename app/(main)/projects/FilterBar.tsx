"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { Artwork } from "@/sanity/lib/queries";

type Props = {
  artworks: Artwork[];
};

// ── Chip ─────────────────────────────────────────────────────────────────────

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
        "px-4 py-1.5 text-base font-body font-bold border-2 transition-shadow cursor-pointer whitespace-nowrap",
        selected
          ? "border-pink shadow-[4px_4px_0_0_#DC738F]"
          : "border-fg hover:shadow-[4px_4px_0_0_var(--fg)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ── DropdownFilter ────────────────────────────────────────────────────────────

function DropdownFilter({
  label,
  selected,
  options,
  onSelect,
  onClear,
}: {
  label: string;
  selected: string | null;
  options: { label: string; value: string }[];
  onSelect: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const displayLabel = options.find((o) => o.value === selected)?.label ?? null;

  return (
    <div className="relative" ref={ref}>
      <div
        className={[
          "flex items-center border-2 transition-shadow",
          selected
            ? "border-pink shadow-[4px_4px_0_0_#DC738F]"
            : "border-fg hover:shadow-[4px_4px_0_0_var(--fg)]",
        ].join(" ")}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-4 py-1.5 text-base font-body font-bold cursor-pointer whitespace-nowrap"
        >
          {displayLabel ? `${label}: ${displayLabel}` : `${label} ▾`}
        </button>
        {displayLabel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setOpen(false);
            }}
            aria-label={`Clear ${label} filter`}
            className="pr-3 text-base leading-none cursor-pointer text-fg/60 hover:text-fg"
          >
            ×
          </button>
        )}
      </div>

      {open && options.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-bg border-2 border-fg shadow-[4px_4px_0_0_var(--fg)] z-50">
          <ul>
            {options.map(({ label: optLabel, value }) => (
              <li key={value}>
                <button
                  onClick={() => {
                    onSelect(value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left px-4 py-2 text-base font-body font-bold cursor-pointer hover:bg-fg/5",
                    selected === value ? "text-pink" : "text-fg",
                  ].join(" ")}
                >
                  {optLabel}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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

function findCityLabel(artworks: Artwork[], slug: string) {
  return artworks.find((a) => a.city?.toLowerCase() === slug)?.city ?? slug;
}

// ── Material helpers ─────────────────────────────────────────────────────────
// Materials are free-text tags in Sanity, so editors can type new ones at will.
// Matching happens case-insensitively here instead of constraining input in the
// Studio — "Steel" and "steel" collapse to one filter option, keyed off
// whichever casing was entered first.

function getMaterialOptions(artworks: Artwork[]) {
  const labelByValue = new Map<string, string>();
  for (const a of artworks) {
    for (const raw of a.materials ?? []) {
      const label = raw.trim();
      const value = label.toLowerCase();
      if (value && !labelByValue.has(value)) labelByValue.set(value, label);
    }
  }
  return [...labelByValue.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

export default function FilterBar({ artworks }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const interactive = searchParams.get("interactive") === "true";
  const placement = searchParams.get("placement") as "touring" | "permanent" | "exhibition" | null;
  const citySlug = searchParams.get("city");
  const material = searchParams.get("material");
  const q = searchParams.get("q") ?? "";

  const [locationOpen, setLocationOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

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
      if (value === null) params.delete(key);
      else params.set(key, value);
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

  const placementOptions = [
    { label: "Permanent", value: "permanent" },
    { label: "Exhibition", value: "exhibition" },
    { label: "Touring", value: "touring" },
  ];

  const materialOptions = getMaterialOptions(artworks);

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center gap-2">
        {/* Interactive toggle */}
        <Chip
          label="Interactive"
          selected={interactive}
          onClick={() => setParam("interactive", interactive ? null : "true")}
        />

        {/* Type dropdown */}
        <DropdownFilter
          label="Type"
          selected={placement}
          options={placementOptions}
          onSelect={(v) => setParam("placement", v)}
          onClear={() => setParam("placement", null)}
        />

        {/* Materials dropdown */}
        <DropdownFilter
          label="Materials"
          selected={material}
          options={materialOptions}
          onSelect={(v) => setParam("material", v)}
          onClear={() => setParam("material", null)}
        />

        {/* Location dropdown */}
        <div className="relative" ref={popoverRef}>
          <div
            className={[
              "flex items-center border-2 transition-shadow",
              citySlug
                ? "border-pink shadow-[4px_4px_0_0_#DC738F]"
                : "border-fg hover:shadow-[4px_4px_0_0_var(--fg)]",
            ].join(" ")}
          >
            <button
              onClick={() => setLocationOpen((o) => !o)}
              className="px-4 py-1.5 text-base font-body font-bold cursor-pointer whitespace-nowrap"
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

          {locationOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-bg border-2 border-fg shadow-[4px_4px_0_0_var(--fg)] z-50">
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
                          "w-full text-left px-4 py-2 text-base font-body font-bold flex justify-between items-center cursor-pointer hover:bg-fg/5",
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

        {/* Search — full-width on mobile, inline on desktop */}
        <div
          className={[
            "flex items-center border-2 transition-shadow w-full sm:w-auto sm:ml-auto",
            q ? "border-pink shadow-[4px_4px_0_0_#DC738F]" : "border-fg focus-within:shadow-[4px_4px_0_0_var(--fg)]",
          ].join(" ")}
        >
          <input
            type="text"
            placeholder="Search…"
            value={q}
            onChange={(e) => setParam("q", e.target.value || null)}
            onKeyDown={(e) => e.key === "Escape" && setParam("q", null)}
            className="w-36 sm:w-48 text-base font-body bg-transparent px-4 py-1.5 outline-none placeholder:text-fg/40"
          />
          <button
            onClick={() => q && setParam("q", null)}
            aria-label={q ? "Clear search" : "Search"}
            className="pr-3 text-fg/60 hover:text-fg cursor-pointer"
          >
            <Search size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
