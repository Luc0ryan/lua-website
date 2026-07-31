import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { Artwork } from "@/sanity/lib/queries";

// Subtitle rule: touring → "Touring"; exhibition → "City · Exhibition" (city
// first, tag second — e.g. Burning Man pieces like SIRSANA); permanent → city.
function subtitleLine(a: Artwork) {
  if (a.placement === "touring") return "Touring";
  if (a.placement === "exhibition") {
    return [a.city, "Exhibition"].filter(Boolean).join(" · ");
  }
  return a.city ?? "";
}

export function ArtworkCard({
  artwork,
  featured,
  priority,
}: {
  artwork: Artwork;
  featured: boolean;
  priority?: boolean;
}) {
  const imgUrl = artwork.image ? urlFor(artwork.image).url() : null;

  const subtitle = subtitleLine(artwork);
  const href = artwork.slug?.current ? `/projects/${artwork.slug.current}` : null;

  const card = (
    <div className="group relative aspect-4/3 overflow-hidden rounded-[2px] bg-neutral-200">
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={artwork.title ?? ""}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-300" />
      )}

      {/* Overlay chip — matches the homepage gallery drop-shadow card, scaled
          down for the tighter grid tiles */}
      <div className="absolute bottom-3 right-3 flex max-w-[85%] flex-col items-start overflow-clip border-2 border-fg bg-bg px-4 py-3 shadow-[5px_5px_0_var(--fg)]">
        {subtitle && (
          <span className="font-body text-xs font-normal leading-snug text-fg">
            {subtitle}
          </span>
        )}
        <span className="font-body text-base font-semibold project-title leading-snug text-fg">
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
