import { getRecentCommissionedArtworks } from "@/sanity/lib/queries";
import { ArtworkCard } from "@/app/components/ArtworkCard";
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
          <ArtworkCard
            key={artwork._id}
            artwork={artwork}
            size="lg"
            aspect="aspect-square"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ))}
      </div>
    </section>
  );
}
