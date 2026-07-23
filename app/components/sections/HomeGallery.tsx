import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Single source of truth for the homepage gallery sections (Figma 1140:1604 /
 * 1145). Owns the 12-col desktop grid, the tiles, and the desktop/mobile
 * order logic. The `touringHome` / `commissionHome` wrappers are thin — they
 * only vary `featuredSide` and the CTA target.
 *
 * Layout (desktop): a 7/5 split over two rows.
 *  - Top row: featured (wide, 7) + text cell (narrow, 5); `featuredSide` swaps
 *    which side each lands on.
 *  - Bottom row: wide image (7, left) + square image (5, right) — fixed.
 */

export type GalleryProject = {
  key: string;
  title: string;
  /** Small label line above the title, e.g. "TOURING" / "LAS VEGAS". */
  subtitle: string;
  /** Resolved image URL, or null for a gray placeholder. */
  image?: string | null;
};

type Props = {
  title: string;
  body: string;
  cta: { label: string; href: string };
  projects: GalleryProject[];
  featuredSide: "left" | "right";
};

/**
 * Schema guard: always render exactly 3 projects. If more/fewer are declared or
 * the order is malformed, fall back to the most-recent 3 (last in source order).
 */
function exactlyThree(projects: GalleryProject[]): GalleryProject[] {
  const valid = (projects ?? []).filter((p): p is GalleryProject => !!p && !!p.key);
  return valid.length === 3 ? valid : valid.slice(-3);
}

function Chip({ project }: { project: GalleryProject }) {
  return (
    <div className="absolute bottom-0 right-0 m-4 max-w-[85%]">
      <div className="flex flex-col items-start overflow-clip border-2 border-fg bg-bg p-3 shadow-[8px_8px_0_var(--fg)]">
        {project.subtitle && (
          <span className="font-body text-sm font-normal leading-normal text-fg">
            {project.subtitle}
          </span>
        )}
        <span className="font-body text-xl font-semibold project-title leading-normal text-fg">
          {project.title}
        </span>
      </div>
    </div>
  );
}

function Tile({
  project,
  aspect,
  sizes,
}: {
  project: GalleryProject;
  aspect: string;
  sizes: string;
}) {
  return (
    <div className={`group relative ${aspect} overflow-hidden rounded-[2px] bg-neutral-200`}>
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-300" />
      )}
      <Chip project={project} />
    </div>
  );
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

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-gutter py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-[auto_auto]">
        {/* Text cell */}
        <div className={`flex flex-col justify-between gap-6 px-3 py-6 ${textPlacement}`}>
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-5xl font-semibold uppercase leading-tight text-fg">
              {title}
            </h2>
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
            <Tile project={featured} aspect={wideAspect} sizes="(max-width: 768px) 100vw, 600px" />
          </div>
        )}

        {/* Bottom row — wide image left, square right (fixed) */}
        {tile2 && (
          <div className="md:col-start-1 md:col-span-7 md:row-start-2">
            <Tile project={tile2} aspect={wideAspect} sizes="(max-width: 768px) 100vw, 600px" />
          </div>
        )}
        {tile3 && (
          <div className="md:col-start-8 md:col-span-5 md:row-start-2">
            <Tile project={tile3} aspect="aspect-square" sizes="(max-width: 768px) 100vw, 420px" />
          </div>
        )}
      </div>
    </section>
  );
}
