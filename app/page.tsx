import Hero from "./components/sections/Hero";
import Editorial from "./components/sections/Editorial";
import ProjectGrid from "./components/sections/ProjectGrid";
import InstagramGrid from "./components/sections/InstagramGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mt-40">
        <Editorial />
      </div>
      <div className="mt-40">
        <ProjectGrid />
      </div>
      <div className="mt-40">
        <InstagramGrid />
      </div>
    </>
  );
}
