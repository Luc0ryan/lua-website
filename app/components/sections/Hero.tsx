import HeroAccordion from "../HeroAccordion";
import { getFeaturedArtworks } from "../../../sanity/lib/queries";

export default async function Hero() {
  const featured = await getFeaturedArtworks().catch(() => []);

  if (featured.length > 0) {
    return <HeroAccordion artworks={featured} />;
  }

  return (
    <div className="h-[90vh] min-h-[520px] bg-neutral-800 flex items-end p-12">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-white/60 font-body mb-2">
          Add featured artworks in Sanity Studio
        </p>
        <h1 className="text-5xl font-heading font-bold text-white leading-tight">
          Interactive art built to<br />
          bring <span className="text-[#E8197D]">people</span> together
        </h1>
      </div>
    </div>
  );
}
