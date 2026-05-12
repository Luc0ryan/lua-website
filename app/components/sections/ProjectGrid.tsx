import Image from "next/image";
import { getGalleryArtworks } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import type { Artwork } from "../../../sanity/lib/queries";

function ArtworkCard({ aw, aspectClass }: { aw: Artwork; aspectClass: string }) {
  const src = aw.image
    ? urlFor(aw.image).width(1200).height(900).fit("crop").url()
    : null;

  return (
    <div className="group cursor-pointer">
      <div className={`relative overflow-hidden bg-neutral-200 ${aspectClass}`}>
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
        {aw.city}
      </p>
      <p className="text-base font-heading font-bold text-fg mt-0.5">{aw.title}</p>
    </div>
  );
}

export default async function ProjectGrid() {
  const artworks = await getGalleryArtworks().catch(() => []);
  if (!artworks.length) return null;

  const [first, second, third, fourth, fifth] = artworks;

  return (
    <section className="w-full max-w-6xl mx-auto px-gutter py-16 space-y-4">
      {/* Row 1: full-width panoramic */}
      {first && <ArtworkCard aw={first} aspectClass="aspect-[21/8]" />}

      {/* Row 2: 7/5 asymmetric split */}
      {second && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <ArtworkCard aw={second} aspectClass="aspect-[4/3]" />
          </div>
          {third && (
            <div className="col-span-5">
              <ArtworkCard aw={third} aspectClass="aspect-[4/3]" />
            </div>
          )}
        </div>
      )}

      {/* Row 3: 5/7 asymmetric split (reversed) */}
      {fourth && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <ArtworkCard aw={fourth} aspectClass="aspect-[4/3]" />
          </div>
          {fifth && (
            <div className="col-span-7">
              <ArtworkCard aw={fifth} aspectClass="aspect-[4/3]" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
