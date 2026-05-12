import Hero from "./components/sections/Hero";
import Editorial from "./components/sections/Editorial";
import ProjectGrid from "./components/sections/ProjectGrid";
import InstagramGrid from "./components/sections/InstagramGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mt-20">
        <Editorial />
      </div>
      <div className="mt-20">
        <ProjectGrid />
      </div>
      <div className="mt-20">
        <InstagramGrid />
      </div>
    </>
  );
}
