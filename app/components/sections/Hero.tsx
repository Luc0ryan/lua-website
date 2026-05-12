import HeroAccordion from "../HeroAccordion";
import { DotPanel } from "../dot-system";
import { getHeroArtworks } from "../../../sanity/lib/queries";

export default async function Hero() {
  const artworks = await getHeroArtworks().catch(() => []);

  return (
    // relative makes this the positioning context for the dot layer
    <div className="relative">
      {/* full-bleed: DotPanel fills the viewport edge-to-edge via absolute positioning;
          the parent has no width constraint so no -mx-gutter escape is needed */}
      <DotPanel
        shape="radial-edges"
        intensityRange={[0, 0.75]}
        dotColor="#E8197D"
        opacity={0.4}
        className="absolute inset-0"
      />

      <section className="w-full max-w-6xl mx-auto px-gutter pt-28 pb-8">
        <h1 className="text-7xl font-heading font-bold text-black leading-tight">
          Interactive art made<br />
          <span className="text-[#E8197D]">together</span>, for everyone
        </h1>
      </section>

      <HeroAccordion artworks={artworks} />
    </div>
  );
}
