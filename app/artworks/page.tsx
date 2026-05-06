import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ArtworksGallery from "./ArtworksGallery";
import { getAllArtworks } from "../../sanity/lib/queries";

export const metadata = { title: "Artworks — Looking Up Arts" };

export default async function ArtworksPage() {
  const artworks = await getAllArtworks().catch(() => []);

  return (
    <>
      <Nav />
      <ArtworksGallery artworks={artworks} />
      <Footer />
    </>
  );
}
