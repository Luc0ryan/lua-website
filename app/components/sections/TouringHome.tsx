import HomeGallery from "./HomeGallery";
import { getTouringGalleryProjects } from "@/lib/galleryProjects";

export default async function TouringHome() {
  const projects = await getTouringGalleryProjects();
  if (!projects.length) return null;

  return (
    <HomeGallery
      title="Built to travel"
      body="Some pieces aren’t meant to stay put. Rent from our touring catalogue and bring a moment of wonder to your next event."
      cta={{ label: "Browse the touring catalogue", href: "/catalogue" }}
      projects={projects}
      featuredSide="right"
    />
  );
}
