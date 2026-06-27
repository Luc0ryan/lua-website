import HeroFull from "../components/sections/HeroFull";
import Editorial from "../components/sections/Editorial";
import TouringHome from "../components/sections/TouringHome";
import CommissionHome from "../components/sections/CommissionHome";
import InstagramGrid from "../components/sections/InstagramGrid";

export default function HomePage() {
  return (
    <>
      <HeroFull />
      <div className="mt-12">
        <Editorial />
      </div>
      <div className="mt-12">
        <TouringHome />
      </div>
      <div className="mt-12">
        <CommissionHome />
      </div>
      <div className="mt-12">
        <InstagramGrid />
      </div>
    </>
  );
}
