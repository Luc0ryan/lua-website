import HomeGallery, { type GalleryProject } from "./HomeGallery";

// Placeholder tiles (gray; image: null) — schema wiring is the next step. Labels
// mirror the Figma mock so the chip layout is exercised.
const projects: GalleryProject[] = [
  { key: "touring-1", title: "Phoenicopterus Rex", subtitle: "TOURING", image: null },
  { key: "touring-2", title: "Ice Cream", subtitle: "LAS VEGAS", image: null },
  { key: "touring-3", title: "Feel Love", subtitle: "LAS VEGAS", image: null },
];

export default function TouringHome() {
  return (
    <HomeGallery
      title="Touring artwork"
      body="Our most unique pieces don’t have a forever home. That next home can be your event."
      cta={{ label: "Check out our touring catalogue", href: "/catalogue" }}
      projects={projects}
      featuredSide="left"
    />
  );
}
