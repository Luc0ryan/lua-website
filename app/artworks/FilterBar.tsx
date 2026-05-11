"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { ArtworkIndexItem } from "../../sanity/lib/queries";

type Props = {
  artworks: ArtworkIndexItem[];
  interactive: boolean;
  type: "touring" | "permanent" | null;
  city: string | null;
  setParam: (key: string, value: string | null) => void;
};

function chip(selected: boolean) {
  return (
    "inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-body tracking-wider " +
    "rounded-full border-2 cursor-pointer transition-colors duration-150 select-none " +
    (selected
      ? "border-magenta text-fg"
      : "border-fg/20 text-fg hover:border-fg/60")
  );
}

export default function FilterBar({ artworks, interactive, type, city, setParam }: Props) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [search, setSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!locationOpen) return;
    function onDown(e: MouseEvent) {
      if (!popoverRef.current?.contains(e.target as Node)) setLocationOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [locationOpen]);

  const cityCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of artworks) {
      if (a.city && !a.touring) map.set(a.city, (map.get(a.city) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([c]) => c.toLowerCase().includes(search.toLowerCase()));
  }, [artworks, search]);

  const cityLabel = city ? `Location: ${city.split(",")[0].trim()}` : "Location ▾";

  return (
    <div className="mb-10 flex items-center flex-wrap" style={{ gap: "8px 32px" }}>
      {/* Interactive */}
      <button className={chip(interactive)} onClick={() => setParam("interactive", interactive ? null : "true")}>
        Interactive
      </button>

      {/* Touring / Permanent */}
      <div className="flex gap-2">
        {(["touring", "permanent"] as const).map((t) => (
          <button
            key={t}
            className={chip(type === t)}
            onClick={() => setParam("type", type === t ? null : t)}
          >
            {t === "touring" ? "Touring" : "Permanent"}
          </button>
        ))}
      </div>

      {/* Location */}
      <div className="relative" ref={popoverRef}>
        <button className={chip(city !== null)} onClick={() => setLocationOpen((o) => !o)}>
          {cityLabel}
          {city && (
            <span
              aria-label="Clear location"
              className="text-fg/40 hover:text-fg leading-none"
              onClick={(e) => {
                e.stopPropagation();
                setParam("city", null);
                setLocationOpen(false);
              }}
            >
              ×
            </span>
          )}
        </button>

        {locationOpen && (
          <div className="absolute left-0 top-full mt-2 w-64 bg-bg border border-fg/10 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b border-fg/10">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities…"
                className="w-full text-xs font-body bg-transparent outline-none placeholder:text-fg/40"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto py-1">
              {cityCounts.length === 0 ? (
                <li className="px-4 py-2 text-xs font-body text-fg/40">No cities found</li>
              ) : (
                cityCounts.map(([c, count]) => (
                  <li key={c}>
                    <button
                      className="w-full text-left px-4 py-2 text-xs font-body hover:bg-fg/5 flex justify-between"
                      onClick={() => {
                        setParam("city", c);
                        setLocationOpen(false);
                        setSearch("");
                      }}
                    >
                      <span>{c}</span>
                      <span className="text-fg/40">{count}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
