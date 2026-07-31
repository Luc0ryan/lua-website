import { buildRows } from "./buildRows";
import { ArtworkCard } from "@/app/components/ArtworkCard";
import type { Artwork } from "@/sanity/lib/queries";

type Props = { artworks: Artwork[] };

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
