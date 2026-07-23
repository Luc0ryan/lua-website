import HomeGallery from "./HomeGallery";
import { getCommissionGalleryProjects } from "@/lib/galleryProjects";

export default async function CommissionHome() {
  const projects = await getCommissionGalleryProjects();
  if (!projects.length) return null;

  return (
    <HomeGallery
      title="Built to belong somewhere"
      body="We partner with civic institutions and private clients to design and fabricate permanent work — sculpture built for a specific site, and built to last."
      cta={{ label: "See our permanent installations", href: "/projects#permanent" }}
      projects={projects}
      featuredSide="left"
    />
  );
}
