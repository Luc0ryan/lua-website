import Image from "next/image";
import { getGalleryArtworks } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import type { Artwork } from "../../../sanity/lib/queries";

function artworkSubtitle(aw: Artwork): string {
  if (aw.placement === "touring") {
    return aw.materials?.[0] ?? "Touring";
  }
  const parts = [aw.city, aw.year?.toString()].filter((p): p is string => !!p);
  return parts.join(" · ");
}

function CardOverlay({ aw }: { aw: Artwork }) {
  const subtitle = artworkSubtitle(aw);
  return (
    <div className="absolute bottom-0 right-0 m-4">
      <div className="bg-white px-5 py-4 shadow-[inset_0_0_0_2px_#111,4px_4px_0_#111]">
        {subtitle && (
          <span className="block font-sans text-[13px] font-semibold uppercase tracking-widest text-gray-label">
            {subtitle}
          </span>
        )}
        <span className="mt-0.5 block font-heading font-normal leading-tight text-black text-[28px]">
          {aw.title}
        </span>
      </div>
    </div>
  );
}

// 7-col card: uses absolute fill so the grid row height is driven by the 5-col square
function LargeCard({ aw, sizes }: { aw: Artwork; sizes: string }) {
  const src = aw.image ? urlFor(aw.image).url() : null;
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2px] bg-neutral-200 group cursor-pointer">
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
      <CardOverlay aw={aw} />
    </div>
  );
}

// 5-col card: aspect-square drives the row height
function SquareCard({ aw, sizes }: { aw: Artwork; sizes: string }) {
  const src = aw.image ? urlFor(aw.image).url() : null;
  return (
    <div className="relative aspect-square overflow-hidden rounded-[2px] bg-neutral-200 group cursor-pointer">
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
      <CardOverlay aw={aw} />
    </div>
  );
}

export default async function ProjectGrid() {
  const artworks = await getGalleryArtworks().catch(() => []);
  if (!artworks.length) return null;

  const [first, second, third, fourth, fifth, sixth] = artworks;

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-gutter py-10 flex flex-col gap-4">
      {/* Row 1: 7-left (large) | 5-right (square) */}
      {first && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 relative">
            <LargeCard aw={first} sizes="(max-width: 768px) 100vw, 820px" />
          </div>
          {second && (
            <div className="col-span-5">
              <SquareCard aw={second} sizes="(max-width: 768px) 100vw, 590px" />
            </div>
          )}
        </div>
      )}

      {/* Row 2: 5-left (square) | 7-right (large) */}
      {third && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <SquareCard aw={third} sizes="(max-width: 768px) 100vw, 590px" />
          </div>
          {fourth && (
            <div className="col-span-7 relative">
              <LargeCard aw={fourth} sizes="(max-width: 768px) 100vw, 820px" />
            </div>
          )}
        </div>
      )}

      {/* Row 3: 7-left (large) | 5-right (square) */}
      {fifth && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 relative">
            <LargeCard aw={fifth} sizes="(max-width: 768px) 100vw, 820px" />
          </div>
          {sixth && (
            <div className="col-span-5">
              <SquareCard aw={sixth} sizes="(max-width: 768px) 100vw, 590px" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
