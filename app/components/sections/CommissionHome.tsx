import HomeGallery from "./HomeGallery";
import { getCommissionGalleryProjects } from "@/lib/galleryProjects";

export default async function CommissionHome() {
  const projects = await getCommissionGalleryProjects();
  if (!projects.length) return null;

  return (
    <HomeGallery
      title="Commission uniquely"
      body="We work with civic institutions and private groups alike to build pieces that bring wonder to communities."
      cta={{ label: "Check out our touring catalogue", href: "/projects#permanent" }}
      projects={projects}
      featuredSide="left"
    />
  );
}
