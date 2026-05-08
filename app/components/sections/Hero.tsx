import HeroAccordion from "../HeroAccordion";
import { getHeroArtworks } from "../../../sanity/lib/queries";

export default async function Hero() {
  const artworks = await getHeroArtworks().catch(() => []);

  return (
    <>
      <section className="px-4 md:px-8 pt-28 pb-8 w-full max-w-6xl mx-auto">
        <h1 className="text-7xl font-heading font-bold text-black leading-tight">
          Interactive art made<br />
          <span className="text-[#E8197D]">together</span>, for everyone
        </h1>
      </section>

      <HeroAccordion artworks={artworks} />
    </>
  );
}
