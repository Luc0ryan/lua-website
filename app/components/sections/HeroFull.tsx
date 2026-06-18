import HeroCycler from "../HeroCycler";
import { getHeroProjects } from "@/lib/heroProjects";

export default async function HeroFull() {
  const projects = await getHeroProjects();
  return <HeroCycler projects={projects} />;
}
