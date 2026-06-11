"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";
import type { Artwork } from "../../../sanity/lib/queries";

type Props = { artworks: Artwork[] };

export default function HeroAccordion({ artworks }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!artworks.length) return null;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-gutter flex gap-2 min-h-[65vh]">
      {artworks.map((aw, i) => {
          const isActive = i === activeIdx;
          const imgSrc = aw.image ? urlFor(aw.image).url() : null;

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
                  sizes="(max-width: 768px) 100vw, 1100px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-800" />
              )}

              {/* Focused: progressive blur + gradient, bottom 33% */}
              {isActive && (
                <div className="absolute inset-0 backdrop-blur-[4px] bg-linear-to-t from-black/45 to-transparent [mask-image:linear-gradient(to_top,black_0%,transparent_45%)]" />
              )}

              {/* Active: title + location bottom-left */}
              <div
                className={`absolute bottom-4 left-4 text-white transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-[13px] uppercase tracking-widest font-body mb-1 opacity-70">
                  {aw.placement === "touring" ? "Touring" : aw.city}
                </p>
                <p className="text-2xl font-heading font-bold leading-tight">{aw.title}</p>
              </div>

            </div>
          );
        })}
      </div>
  );
}
