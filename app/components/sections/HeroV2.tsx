import HeroAccordionV2 from "../HeroAccordionV2";
import { getHeroArtworks } from "../../../sanity/lib/queries";

export default async function HeroV2() {
  const artworks = await getHeroArtworks().catch(() => []);
  return <HeroAccordionV2 artworks={artworks} />;
}
