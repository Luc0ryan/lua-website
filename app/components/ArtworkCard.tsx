import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { Artwork } from "@/sanity/lib/queries";
import { projectSubtitle } from "@/lib/projectSubtitle";

// The one project card used everywhere: the Projects grid, homepage gallery,
// Commission "Selected Works", Related Works and Donate. Pass the Sanity
// project as-is (include `slug` in the query so the card links).
//
// `size` only changes the chip's scale; data, link and behavior are identical.
const CHIP = {
  md: { wrap: "m-3 px-4 py-3", subtitle: "text-xs leading-snug", title: "text-base leading-snug" },
  lg: { wrap: "m-4 p-3", subtitle: "text-sm leading-normal", title: "text-xl leading-normal" },
} as const;

type Props = {
  artwork: Artwork;
  size?: keyof typeof CHIP;
  /** Tailwind aspect class for the image box. */
  aspect?: string;
  /** `sizes` for next/image — how wide the card renders at each breakpoint. */
  sizes?: string;
  priority?: boolean;
};

export function ArtworkCard({
  artwork,
  size = "md",
  aspect = "aspect-4/3",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
}: Props) {
  const imgUrl = artwork.image ? urlFor(artwork.image).url() : null;
  const subtitle = projectSubtitle(artwork);
  const href = artwork.slug?.current ? `/projects/${artwork.slug.current}` : null;
  const chip = CHIP[size];

  const card = (
    <div className={`group relative ${aspect} overflow-hidden rounded-[2px] bg-neutral-200`}>
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={artwork.title ?? ""}
          fill
          priority={priority}
          sizes={sizes}
          // Hover zoom only when the card is a link (AGENTS.md).
          className={`object-cover ${
            href ? "transition-transform duration-500 ease-out group-hover:scale-[1.03]" : ""
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-300" />
      )}

      <div
        className={`absolute bottom-0 right-0 flex max-w-[85%] flex-col items-start overflow-clip border-2 border-fg bg-bg shadow-[5px_5px_0_var(--fg)] ${chip.wrap}`}
      >
        {subtitle && (
          <span className={`font-body font-normal text-fg ${chip.subtitle}`}>{subtitle}</span>
        )}
        <span className={`font-body font-semibold project-title text-fg ${chip.title}`}>
          {artwork.title}
        </span>
      </div>
    </div>
  );

  if (!href) return card;

  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
}
