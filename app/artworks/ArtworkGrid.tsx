import Image from "next/image";
import { urlFor } from "../../sanity/lib/image";
import { buildRows } from "./buildRows";
import type { ArtworkIndex } from "../../sanity/lib/queries";

type Props = { artworks: ArtworkIndex[] };

function locationLine(a: ArtworkIndex) {
  return a.type === "touring" ? "Touring" : (a.city ?? "");
}

function ArtworkCard({ artwork, featured }: { artwork: ArtworkIndex; featured: boolean }) {
  const imgUrl = artwork.image
    ? urlFor(artwork.image)
        .width(featured ? 900 : 600)
        .height(featured ? 675 : 450)
        .fit("crop")
        .url()
    : null;

  return (
    <div
      className={[
        "group cursor-pointer transition-transform duration-300 ease-out",
        featured ? "hover:-translate-y-1" : "hover:-translate-y-0.5",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-neutral-200 aspect-[4/3]">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={artwork.title ?? ""}
            fill
            className="object-cover"
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-300" />
        )}
      </div>

      {/* Metadata */}
      <p
        className={[
          "font-heading font-bold text-fg mt-3 leading-tight",
          featured ? "text-[18px]" : "text-base",
        ].join(" ")}
      >
        {artwork.title}
      </p>
      <p className="text-sm font-body text-fg/50 mt-0.5">{locationLine(artwork)}</p>
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
            />
          ))}
        </div>
      ))}
    </div>
  );
}
