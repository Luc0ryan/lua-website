import HeroStage from "../components/sections/HeroStage";
import Editorial from "../components/sections/Editorial";
import ProjectGrid from "../components/sections/ProjectGrid";
import InstagramGrid from "../components/sections/InstagramGrid";

export default function HomePage() {
  return (
    <>
      <HeroStage />
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
