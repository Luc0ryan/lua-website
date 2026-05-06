"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/image";
import type { Artwork } from "../../sanity/lib/queries";

const CATEGORIES = ["Interactive", "Public / Civic", "Festival / Event"];

type Props = { artworks: Artwork[] };

export default function ArtworksGallery({ artworks }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? artworks.filter((a) => a.category === active) : artworks;

  // Deterministic layout pattern: 3-col, 2-col, 3-col repeating
  function rowPattern(idx: number): string {
    const patterns = ["grid-cols-3", "grid-cols-2", "grid-cols-3"];
    return patterns[idx % patterns.length];
  }

  // Chunk filtered artworks into rows of varying sizes
  const rowSizes = [3, 2, 3];
  const rows: Artwork[][] = [];
  let offset = 0;
  let rowIdx = 0;
  while (offset < filtered.length) {
    const size = rowSizes[rowIdx % rowSizes.length];
    rows.push(filtered.slice(offset, offset + size));
    offset += size;
    rowIdx++;
  }

  return (
    <div className="max-w-6xl mx-auto px-8 pt-32 pb-16">
      {/* Filter bar */}
      <div className="mb-10">
        <p className="text-[10px] font-body tracking-widest uppercase text-fg/50 mb-4">SHOW</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(isActive ? null : cat)}
                className={`px-4 py-1.5 text-xs font-body tracking-wider rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-[#E8197D] border-[#E8197D] text-white"
                    : "border-fg/30 text-fg bg-transparent hover:border-fg hover:shadow-sm"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className={`grid ${rowPattern(ri)} gap-4`}
          >
            {row.map((aw) => {
              const src = aw.image
                ? urlFor(aw.image).width(700).height(530).fit("crop").url()
                : null;
              return (
                <div
                  key={aw._id}
                  className="group cursor-pointer"
                  style={{
                    opacity: 1,
                    transform: "translateY(0)",
                    transition: "opacity 300ms ease, transform 300ms ease",
                  }}
                >
                  <div
                    className="overflow-hidden bg-neutral-200 relative"
                    style={{ aspectRatio: "4/3" }}
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={aw.title ?? ""}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-300" />
                    )}
                  </div>
                  <p className="text-base font-heading font-bold text-fg mt-3 leading-tight">
                    {aw.title}
                  </p>
                  <p className="text-sm font-body text-fg/50 mt-0.5">
                    {aw.location ?? "Touring Installation"}
                  </p>
                </div>
              );
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm font-body text-fg/50 py-16 text-center">
            No artworks in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
