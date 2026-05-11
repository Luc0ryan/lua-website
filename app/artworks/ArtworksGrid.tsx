import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../sanity/lib/image";
import type { Row } from "./buildRows";
import type { ArtworkIndexItem } from "../../sanity/lib/queries";

type Props = { rows: Row<ArtworkIndexItem>[] };

export default function ArtworksGrid({ rows }: Props) {
  return (
    <div className="space-y-4">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className={`grid gap-4 ${row.columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {row.items.map((aw) => {
            const isFeatured = aw.featured && row.columns === 2;
            const src = aw.image
              ? urlFor(aw.image)
                  .width(isFeatured ? 960 : 640)
                  .height(isFeatured ? 720 : 480)
                  .fit("crop")
                  .url()
              : null;
            const locationLine = aw.touring ? "Touring" : (aw.city ?? "");

            return (
              <Link
                key={aw._id}
                href={`/artworks/${aw._id}`}
                className={`group block transition-transform duration-300 ease-out ${
                  isFeatured ? "hover:-translate-y-1" : "hover:-translate-y-0.5"
                }`}
              >
                <div className="relative overflow-hidden bg-neutral-200" style={{ aspectRatio: "4/3" }}>
                  {src ? (
                    <Image
                      src={src}
                      alt={aw.title ?? ""}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes={
                        isFeatured
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, 33vw"
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-300" />
                  )}
                </div>
                <p
                  className={`font-heading font-bold text-fg mt-3 leading-tight ${
                    isFeatured ? "text-[18px]" : "text-[16px]"
                  }`}
                >
                  {aw.title}
                </p>
                {locationLine && (
                  <p className="text-sm font-body text-fg/50 mt-0.5">{locationLine}</p>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
