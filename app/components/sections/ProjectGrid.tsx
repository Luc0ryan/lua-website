import Image from "next/image";
import { getGalleryArtworks } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import type { Artwork } from "../../../sanity/lib/queries";

function ArtworkCard({ aw, aspectClass, sizes }: { aw: Artwork; aspectClass: string; sizes: string }) {
  const src = aw.image
    ? urlFor(aw.image).url()
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
            sizes={sizes}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-300" />
        )}
      </div>
      <p className="text-xs font-body uppercase tracking-widest text-fg/50 mt-3 mb-1">
        {aw.city || "Touring"}
      </p>
      <p className="text-base font-heading font-bold text-fg uppercase leading-tight">{aw.title}</p>
    </div>
  );
}

export default async function ProjectGrid() {
  const artworks = await getGalleryArtworks().catch(() => []);
  if (!artworks.length) return null;

  const [first, second, third, fourth, fifth, sixth] = artworks;

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-gutter py-10 space-y-4">
      {/* Row 1: 8/4 asymmetric split (dominant left) */}
      {first && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <ArtworkCard aw={first} aspectClass="h-[520px]" sizes="(max-width: 768px) 100vw, 940px" />
          </div>
          {second && (
            <div className="md:col-span-4">
              <ArtworkCard aw={second} aspectClass="h-[520px]" sizes="(max-width: 768px) 100vw, 470px" />
            </div>
          )}
        </div>
      )}

      {/* Row 2: 5/7 asymmetric split (dominant right) */}
      {third && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <ArtworkCard aw={third} aspectClass="h-[480px]" sizes="(max-width: 768px) 100vw, 590px" />
          </div>
          {fourth && (
            <div className="md:col-span-7">
              <ArtworkCard aw={fourth} aspectClass="h-[480px]" sizes="(max-width: 768px) 100vw, 820px" />
            </div>
          )}
        </div>
      )}

      {/* Row 3: 7/5 asymmetric split (dominant left) */}
      {fifth && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7">
            <ArtworkCard aw={fifth} aspectClass="h-[500px]" sizes="(max-width: 768px) 100vw, 820px" />
          </div>
          {sixth && (
            <div className="md:col-span-5">
              <ArtworkCard aw={sixth} aspectClass="h-[500px]" sizes="(max-width: 768px) 100vw, 590px" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
