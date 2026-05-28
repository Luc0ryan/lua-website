"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/image";
import type { Artwork } from "../../sanity/lib/queries";

type Props = { artworks: Artwork[] };

export default function HeroAccordion({ artworks }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!artworks.length) return null;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-gutter flex gap-2 min-h-125">
      {artworks.map((aw, i) => {
          const isActive = i === activeIdx;
          const imgSrc = aw.image
            ? urlFor(aw.image).width(1200).height(800).fit("crop").url()
            : null;

          return (
            <div
              key={aw._id}
              onClick={() => setActiveIdx(i)}
              className={`relative overflow-hidden cursor-pointer select-none transition-all duration-500 ease-in-out min-w-0 rounded-xs self-stretch ${
    isActive ? "flex-5" : "flex-[0.4] hover:flex-[0.55]"
              }`}
            >
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={aw.title ?? ""}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority={i === 0}
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-800" />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Active: title + location bottom-left */}
              <div
                className={`absolute bottom-4 left-4 text-white transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-[10px] uppercase tracking-widest font-body mb-1 opacity-70">
                  {aw.city}
                </p>
                <p className="text-lg font-heading font-bold leading-tight">{aw.title}</p>
              </div>

              {/* Inactive: vertical label */}
              {!isActive && (
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <p
                    className="text-white text-[11px] uppercase tracking-widest font-body font-medium whitespace-nowrap opacity-80"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {aw.city ?? aw.title}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
  );
}