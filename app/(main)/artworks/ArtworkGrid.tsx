import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { buildRows } from "./buildRows";
import type { Artwork } from "@/sanity/lib/queries";

type Props = { artworks: Artwork[] };

function locationLine(a: Artwork) {
  return a.placement === "touring" ? "Touring" : (a.city ?? "");
}

function ArtworkCard({ artwork, featured, priority }: { artwork: Artwork; featured: boolean; priority?: boolean }) {
  const imgUrl = artwork.image
    ? urlFor(artwork.image).url()
    : null;

  return (
    <div
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-neutral-200 aspect-4/3">
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
      </div>

      {/* Metadata */}
      <p className="text-xs font-body uppercase tracking-widest text-fg/50 mt-3 mb-1">
        {locationLine(artwork)}
      </p>
      <p
        className={[
          "font-heading font-bold text-fg uppercase leading-tight",
          featured ? "text-[18px]" : "text-base",
        ].join(" ")}
      >
        {artwork.title}
      </p>
    </div>
  );
}

export default function ArtworkGrid({ artworks }: Props) {
  const rows = buildRows(artworks);

  return (
    <div className="space-y-6">
      {rows.map((row, i) => (
        <div
          key={i}
          className={["grid gap-4", row.columns === 2 ? "grid-cols-2" : "grid-cols-3"].join(" ")}
        >
          {row.items.map((artwork) => (
            <ArtworkCard
              key={artwork._id}
              artwork={artwork}
              featured={row.columns === 2}
              priority={i === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
