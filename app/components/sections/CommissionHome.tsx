import HomeGallery from "./HomeGallery";
import { getCommissionArtworks } from "@/sanity/lib/queries";

export default async function CommissionHome() {
  const projects = await getCommissionArtworks().catch(() => []);
  if (!projects.length) return null;

  return (
    <HomeGallery
      title="Built to belong somewhere"
      body="We partner with civic institutions and private clients to design and fabricate permanent work — sculpture built for a specific site, and built to last."
      cta={{ label: "Browse all projects", href: "/projects" }}
      projects={projects}
      featuredSide="left"
    />
  );
}
