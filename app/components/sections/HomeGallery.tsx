import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/app/components/ui/Heading";
import { ArtworkCard } from "@/app/components/ArtworkCard";
import type { Artwork } from "@/sanity/lib/queries";

/**
 * Single source of truth for the homepage gallery sections (Figma 1140:1604 /
 * 1145). Owns the 12-col desktop grid, the tiles, and the desktop/mobile
 * order logic. Tiles are the shared <ArtworkCard size="lg">, so they link to
 * the project page exactly like the Projects grid. The TouringHome /
 * CommissionHome wrappers only vary `featuredSide` and the CTA target.
 *
 * Layout (desktop): a 7/5 split over two rows.
 *  - Top row: featured (wide, 7) + text cell (narrow, 5); `featuredSide` swaps
 *    which side each lands on.
 *  - Bottom row: wide image (7, left) + square image (5, right) — fixed.
 */

type Props = {
  title: string;
  body: string;
  cta: { label: string; href: string };
  projects: Artwork[];
  featuredSide: "left" | "right";
};

/**
 * Schema guard: always render exactly 3 projects. If more/fewer are declared or
 * the order is malformed, fall back to the most-recent 3 (last in source order).
 */
function exactlyThree(projects: Artwork[]): Artwork[] {
  const valid = (projects ?? []).filter((p): p is Artwork => !!p && !!p._id);
  return valid.length === 3 ? valid : valid.slice(-3);
}

export default function HomeGallery({ title, body, cta, projects, featuredSide }: Props) {
  const [featured, tile2, tile3] = exactlyThree(projects);

  // DOM order is always text → featured → tile2 → tile3 (mobile-correct: content
  // first, photos after). Desktop placement is by explicit grid lines; only the
  // text/featured pair swaps sides with `featuredSide`.
  const textPlacement =
    featuredSide === "left"
      ? "md:col-start-8 md:col-span-5 md:row-start-1"
      : "md:col-start-1 md:col-span-5 md:row-start-1";
  const featuredPlacement =
    featuredSide === "left"
      ? "md:col-start-1 md:col-span-7 md:row-start-1"
      : "md:col-start-6 md:col-span-7 md:row-start-1";

  const wideAspect = "aspect-[597/415]";
  // Tile widths in the 12-col grid (content maxes at 1408px): 7 cols ≈ 811px, 5 cols ≈ 573px.
  const wideSizes = "(max-width: 768px) 100vw, (max-width: 1536px) 58vw, 820px";
  const squareSizes = "(max-width: 768px) 100vw, (max-width: 1536px) 42vw, 580px";

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-gutter py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-[auto_auto]">
        {/* Text cell */}
        <div className={`flex flex-col justify-between gap-6 px-3 py-6 ${textPlacement}`}>
          <div className="flex flex-col gap-3">
            <Heading level="h2" className="uppercase leading-tight text-fg">
              {title}
            </Heading>
            <p className="font-body text-xl leading-normal text-fg">{body}</p>
          </div>
          <Link
            href={cta.href}
            className="group inline-flex items-center gap-2.5 font-heading text-2xl font-semibold text-fg transition-colors duration-150 hover:text-pink focus-visible:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
          >
            {cta.label}
            <ArrowRight
              size={24}
              strokeWidth={2.25}
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {/* Featured cell */}
        {featured && (
          <div className={featuredPlacement}>
            <ArtworkCard artwork={featured} size="lg" aspect={wideAspect} sizes={wideSizes} />
          </div>
        )}

        {/* Bottom row — wide image left, square right (fixed) */}
        {tile2 && (
          <div className="md:col-start-1 md:col-span-7 md:row-start-2">
            <ArtworkCard artwork={tile2} size="lg" aspect={wideAspect} sizes={wideSizes} />
          </div>
        )}
        {tile3 && (
          <div className="md:col-start-8 md:col-span-5 md:row-start-2">
            <ArtworkCard artwork={tile3} size="lg" aspect="aspect-square" sizes={squareSizes} />
          </div>
        )}
      </div>
    </section>
  );
}
