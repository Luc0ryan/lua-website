import HomeGallery from "./HomeGallery";
import { getTouringGalleryProjects } from "@/lib/galleryProjects";

export default async function TouringHome() {
  const projects = await getTouringGalleryProjects();
  if (!projects.length) return null;

  return (
    <HomeGallery
      title="Built to travel"
      body="Some pieces aren’t meant to stay put. See where our touring work has traveled and where it’s showing now on our interactive map, then get in touch to bring a piece to your event."
      cta={{ label: "Explore the touring map", href: "/map" }}
      projects={projects}
      featuredSide="right"
    />
  );
}
