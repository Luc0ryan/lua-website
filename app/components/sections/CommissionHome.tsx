import HomeGallery, { type GalleryProject } from "./HomeGallery";

// Placeholder tiles (gray; image: null) — schema wiring is the next step. Labels
// mirror the Figma mock so the chip layout is exercised.
const projects: GalleryProject[] = [
  { key: "commission-1", title: "Arbor Lights", subtitle: "TOURING", image: null },
  { key: "commission-2", title: "Ice Cream DJ Booth", subtitle: "LAS VEGAS", image: null },
  { key: "commission-3", title: "Feel Love", subtitle: "LAS VEGAS", image: null },
];

export default function CommissionHome() {
  return (
    <HomeGallery
      title="Commission uniquely"
      body="We work with civic institutions and private groups alike to build pieces that bring wonder to communities."
      cta={{ label: "Check out our touring catalogue", href: "/artworks#permanent" }}
      projects={projects}
      featuredSide="right"
    />
  );
}
