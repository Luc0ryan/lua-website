import { ArtworkCard } from "@/app/components/ArtworkCard";
import { Heading } from "@/app/components/ui/Heading";
import type { Artwork } from "@/sanity/lib/queries";

export default function RelatedWorks({ artworks }: { artworks: Artwork[] }) {
  if (artworks.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-gutter pb-24">
      <hr className="mb-8 border-t border-fg/20" />
      <Heading level="h3" className="mb-6 uppercase text-fg">
        More to explore
      </Heading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork._id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
}
