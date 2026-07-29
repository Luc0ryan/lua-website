import Image from "next/image";
import Link from "next/link";
import { getRecentCommissionedArtworks } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Heading } from "@/app/components/ui/Heading";

export default async function CommissionSelectedWorks() {
  const artworks = await getRecentCommissionedArtworks();
  if (!artworks.length) return null;

  return (
    <section className="pt-16 pb-16">
      <Heading level="h2" className="text-fg tracking-tight mb-8 md:mb-11">
        Selected Works
      </Heading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {artworks.map((artwork) => (
          <Link
            key={artwork._id}
            href={artwork.slug ? `/projects/${artwork.slug.current}` : "/projects"}
            className="group relative aspect-square overflow-hidden rounded-[2px] bg-neutral-200"
          >
            {artwork.image ? (
              <Image
                src={urlFor(artwork.image).url()}
                alt={artwork.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-300" />
            )}
            <div className="absolute bottom-0 right-0 m-4 max-w-[85%]">
              <div className="flex flex-col items-start overflow-clip border-2 border-fg bg-bg p-3 shadow-[5px_5px_0_#111]">
                <span className="font-body text-sm font-normal leading-normal text-fg">
                  {[artwork.city, artwork.year?.toString()].filter(Boolean).join(" · ")}
                </span>
                <span className="font-body text-xl font-semibold project-title leading-normal text-fg">
                  {artwork.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
