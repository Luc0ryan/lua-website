import HeroAccordion from "../HeroAccordion";
import { DotPanel } from "../dot-system";
import { getHeroArtworks } from "../../../sanity/lib/queries";

export default async function Hero() {
  const artworks = await getHeroArtworks().catch(() => []);

  return (
    // relative makes this the positioning context for the dot layer
    <div className="relative pb-12">
      {/* full-bleed: DotPanel fills the viewport edge-to-edge via absolute positioning;
          the parent has no width constraint so no -mx-gutter escape is needed */}
      <DotPanel
        shape="peak"
        intensityRange={[0, 1]}
        dotColor="#DC738F"
        opacity={0.15}
        className="absolute inset-0"
      />

      <section className="w-full max-w-6xl mx-auto px-gutter pt-40 pb-8">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-black leading-tight">
          Interactive art built to bring <span className="text-pink">people</span> together
        </h1>
      </section>

      <HeroAccordion artworks={artworks} />
    </div>
  );
}
