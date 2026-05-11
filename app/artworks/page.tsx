import { Suspense } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ArtworksGallery from "./ArtworksGallery";
import { getArtworksIndex } from "../../sanity/lib/queries";

export const metadata = { title: "Artworks — Looking Up Arts" };

export default async function ArtworksPage() {
  const artworks = await getArtworksIndex().catch(() => []);

  return (
    <>
      <Nav />
      <Suspense>
        <ArtworksGallery artworks={artworks} />
      </Suspense>
      <Footer />
    </>
  );
}
