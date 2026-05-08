import Image from "next/image";
import { getAllArtworks } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

export default async function ProjectGrid() {
  const artworks = await getAllArtworks().catch(() => []);
  const displayed = artworks.slice(0, 6);

  if (!displayed.length) return null;

  const rows: Array<{ items: typeof displayed; cols: string }> = [
    { items: displayed.slice(0, 1), cols: "grid-cols-1" },
    { items: displayed.slice(1, 3), cols: "grid-cols-2" },
    { items: displayed.slice(3, 6), cols: "grid-cols-3" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-8 py-16 space-y-4">
      {rows.map((row, ri) => (
        <div key={ri} className={`grid ${row.cols} gap-4`}>
          {row.items.map((aw) => {
            const src = aw.image
              ? urlFor(aw.image).width(800).height(600).fit("crop").url()
              : null;
            return (
              <div key={aw._id} className="group cursor-pointer">
                <div className="overflow-hidden bg-neutral-200 relative"
                  style={{ aspectRatio: "4/3" }}>
                  {src ? (
                    <Image
                      src={src}
                      alt={aw.title ?? ""}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-300" />
                  )}
                </div>
                <p className="text-[10px] font-body uppercase tracking-widest text-[--color-gray-label] mt-3">
                  {aw.location}
                </p>
                <p className="text-base font-heading font-bold text-fg mt-0.5">{aw.title}</p>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}
