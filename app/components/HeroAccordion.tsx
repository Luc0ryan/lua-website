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
    <div className="flex h-screen min-h-130 overflow-hidden scroll-snap-align-start">
      {artworks.map((aw, i) => {
        const isActive = i === activeIdx;
        const imgSrc = aw.image
          ? urlFor(aw.image).width(1400).height(900).fit("crop").url()
          : null;

        return (
          <div
            key={aw._id}
            onClick={() => setActiveIdx(i)}
            className={`relative overflow-hidden cursor-pointer select-none transition-all duration-500 ease-in-out min-w-0 ${
              isActive ? "flex-5" : "flex-[0.4] hover:flex-[0.55]"
            }`}
          >
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={aw.title ?? ""}
                fill
                className="object-cover transition-transform duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority={i === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-800" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            <div
              className={`absolute bottom-5 left-5 text-white transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-[10px] uppercase tracking-widest font-body mb-1 opacity-80">
                {aw.location}
              </p>
              <p className="text-xl font-heading font-bold leading-tight">{aw.title}</p>
            </div>

            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className="text-white text-lg uppercase tracking-widest font-body font-medium whitespace-nowrap"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {aw.title}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}