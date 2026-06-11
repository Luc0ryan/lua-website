"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";
import type { Artwork } from "../../../sanity/lib/queries";
import { DotField, DotMask } from "./dot-system";

type Props = { artworks: Artwork[] };

const BRAND_PINK = "#C91F6E";
const LIFT_PX = 80;

export default function HeroAccordionV2({ artworks }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setHeroHeight(window.innerHeight);
    handleResize();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollProgress =
    heroHeight > 0 ? Math.min(Math.max(scrollY / heroHeight, 0), 1) : 0;
  const isHeroGone = heroHeight > 0 && scrollY >= heroHeight;

  // Early fade: start at 85% progress, fully gone at 100% — hides overshoot
  const lookUpOpacity =
    scrollProgress < 0.85
      ? 1
      : 1 - Math.min((scrollProgress - 0.85) / 0.15, 1);
  const dominantIdx = hoverIdx ?? activeIdx;

  function getPanelFlex(i: number): number {
    if (dominantIdx === null) return 1;
    return i === dominantIdx ? (hoverIdx !== null ? 4.5 : 5.5) : 1;
  }

  if (!artworks.length) return null;

  const lookUpBase: React.CSSProperties = {
    fontSize: "clamp(4rem, 8vw, 9rem)",
    letterSpacing: "0.35em",
    fontWeight: 800,
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    lineHeight: 1,
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────
          Layer 1 — Full-bleed 100vh accordion section
      ────────────────────────────────────────────────────── */}
      <section
        className="relative w-full h-screen overflow-hidden"
        onClick={() => setActiveIdx(null)}
        aria-label="Featured artwork"
      >
        {/* Accordion panels */}
        <div className="absolute inset-0 flex">
          {artworks.map((aw, i) => {
            const isDominant = dominantIdx === i;
            const imgSrc = aw.image
              ? urlFor(aw.image).url()
              : null;

            return (
              <div
                key={aw._id}
                role="button"
                tabIndex={0}
                aria-label={`${aw.title ?? "Artwork"}${aw.city ? `, ${aw.city}` : ""}`}
                className="relative overflow-hidden cursor-pointer"
                style={{
                  flex: getPanelFlex(i),
                  minWidth: 0,
                  transition: "flex 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(activeIdx === i ? null : i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIdx(activeIdx === i ? null : i);
                  }
                }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                {/* Artwork image */}
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={aw.title ?? ""}
                    fill
                    className="object-cover"
                    sizes={
                      isDominant
                        ? "(max-width: 768px) 100vw, 60vw"
                        : dominantIdx !== null
                        ? "15vw"
                        : "25vw"
                    }
                    priority={i === 0}
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-800" />
                )}

                {/* Top gradient — ~40% panel height for text legibility */}
                <div
                  className="absolute inset-x-0 top-0 pointer-events-none z-[1]"
                  style={{
                    height: "40%",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
                  }}
                />

                {/* Bottom gradient — ~25% panel height for "LOOK UP." region */}
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
                  style={{
                    height: "25%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                  }}
                />

                {/* Layer 2 — per-panel dot overlay (z-5), reacts to dominant state */}
                <div
                  className="absolute inset-0 z-[5] pointer-events-none overflow-hidden"
                  style={{
                    opacity: isDominant ? 0.07 : 1,
                    transition: "opacity 400ms ease-in-out",
                  }}
                >
                  <DotMask
                    shape="fade-bottom"
                    intensityRange={[0.1, 0.9]}
                    className="absolute inset-0"
                  >
                    <DotField dotColor="#DC738F" intensity={0.35} opacity={0.22} />
                  </DotMask>
                </div>

                {/* City label — sliver: vertical, centered; focused: horizontal center-center */}
                {/* Sliver version */}
                <div
                  className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none"
                  style={{
                    opacity: isDominant ? 0 : 1,
                    transition: "opacity 350ms ease",
                  }}
                >
                  <p
                    className="text-white uppercase font-body"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.16em",
                      opacity: 0.7,
                      writingMode: "vertical-rl",
                    }}
                  >
                    {aw.city}
                  </p>
                </div>

                {/* Focused version */}
                <div
                  className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none"
                  style={{
                    opacity: isDominant ? 1 : 0,
                    transition: "opacity 350ms ease",
                  }}
                >
                  <p
                    className="text-white uppercase font-body text-center"
                    style={{ fontSize: "11px", letterSpacing: "0.22em", opacity: 0.9 }}
                  >
                    {aw.city}
                  </p>
                </div>

                {/* Artwork title — top-right, vertical; hides when dominant */}
                <div
                  className="absolute top-4 right-3 z-[6] pointer-events-none"
                  style={{
                    writingMode: "vertical-rl",
                    opacity: isDominant ? 0 : 1,
                    transition: "opacity 350ms ease",
                  }}
                >
                  <p
                    className="text-white uppercase font-body"
                    style={{ fontSize: "9px", letterSpacing: "0.12em", opacity: 0.5 }}
                  >
                    {aw.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 3 — UI chrome: locator tagline (z-20) */}
        <div className="absolute top-0 inset-x-0 z-20 pointer-events-none px-gutter pt-20 md:pt-24">
          <p
            className="text-white uppercase font-body"
            style={{ fontSize: "10px", letterSpacing: "0.22em", opacity: 0.7 }}
          >
            Interactive art for San Francisco
          </p>
        </div>

        {/* Mobile "LOOK UP." — static brand pink, no scroll tracking */}
        <div
          className="md:hidden absolute bottom-0 inset-x-0 z-10 text-center pb-6"
          style={{ ...lookUpBase, color: BRAND_PINK }}
          aria-hidden="true"
        >
          LOOK UP.
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────
          Layer 2 — Desktop fixed "LOOK UP." (scroll-driven)
          Blends with art via mix-blend-mode: difference.
          Rises slightly as hero exits, then fades out.
      ────────────────────────────────────────────────────── */}
      <div
        className="hidden md:block fixed inset-x-0 bottom-0 z-10 text-center pb-6"
        style={{
          ...lookUpBase,
          color: "white",
          mixBlendMode: "difference",
          transform: `translateY(${-scrollProgress * LIFT_PX}px)`,
          opacity: lookUpOpacity,
          visibility: scrollProgress >= 1 ? "hidden" : "visible",
          transition: "visibility 350ms ease",
        }}
        aria-hidden="true"
      >
        LOOK UP.
      </div>

      {/* ──────────────────────────────────────────────────────
          Layer 2 (settled) — Static editorial bridge
          Fades in as brand pink once hero fully exits.
          Acts as the section header for content below.
      ────────────────────────────────────────────────────── */}
      <div
        className="hidden md:block text-center py-12"
        style={{
          ...lookUpBase,
          color: BRAND_PINK,
          opacity: isHeroGone ? 1 : 0,
          transition: "opacity 400ms ease 150ms",
        }}
        aria-hidden={!isHeroGone}
      >
        LOOK UP.
      </div>
    </>
  );
}
