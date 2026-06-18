import HeroFull from "../components/sections/HeroFull";
import Editorial from "../components/sections/Editorial";
import ProjectGrid from "../components/sections/ProjectGrid";
import InstagramGrid from "../components/sections/InstagramGrid";

export default function HomePage() {
  return (
    <>
      <HeroFull />
      <div className="mt-12">
        <Editorial />
      </div>
      <div className="mt-12">
        <ProjectGrid />
      </div>
      <div className="mt-12">
        <InstagramGrid />
      </div>
    </>
  );
}
