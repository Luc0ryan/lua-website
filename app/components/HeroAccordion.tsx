"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/image";
import type { Artwork } from "../../sanity/lib/queries";

type Props = { artworks: Artwork[] };

export default function HeroAccordion({ artworks }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const pathname = usePathname();

  // Reset to equal resting state whenever the homepage is (re-)entered
  useEffect(() => {
    setActiveIdx(null);
  }, [pathname]);

  if (!artworks.length) return null;

  const resting = activeIdx === null;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-gutter flex gap-2 min-h-[calc(100vh-13rem)]">
      {artworks.map((aw, i) => {
        const isActive = i === activeIdx;
        const imgSrc = aw.image ? urlFor(aw.image).fit("crop").url() : null;

        const flexClass = resting
          ? "flex-1 hover:flex-[1.1]"
          : isActive
          ? "flex-5"
          : "flex-[0.4] hover:flex-[0.55]";

        return (
          <div
            key={aw._id}
            onClick={() => setActiveIdx(i)}
            className={`relative overflow-hidden cursor-pointer select-none transition-all duration-500 ease-in-out min-w-0 rounded-xs self-stretch ${flexClass}`}
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
                {aw.placement === "touring" ? "Touring" : aw.city}
              </p>
              <p className="text-lg font-heading font-bold leading-tight">{aw.title}</p>
            </div>

            {/* Subservient + resting: label */}
            {!isActive && (
              <div className={`absolute inset-0 flex items-end justify-center ${resting ? "pb-6 px-4" : "pb-4"}`}>
                <p
                  className={`text-white font-body font-medium opacity-80 ${
                    resting
                      ? "text-sm uppercase tracking-wide text-center leading-snug"
                      : "text-[11px] uppercase tracking-widest whitespace-nowrap"
                  }`}
                  style={resting ? undefined : { writingMode: "vertical-rl", transform: "rotate(180deg)" }}
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
