import HomeGallery from "./HomeGallery";
import { getTouringGalleryProjects } from "@/lib/galleryProjects";

export default async function TouringHome() {
  const projects = await getTouringGalleryProjects();
  if (!projects.length) return null;

  return (
    <HomeGallery
      title="Touring artwork"
      body="Our most unique pieces don’t have a forever home. That next home can be your event."
      cta={{ label: "Check out our touring catalogue", href: "/catalogue" }}
      projects={projects}
      featuredSide="right"
    />
  );
}
