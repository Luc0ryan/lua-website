import type { Metadata } from "next";
import { getMapLocations } from "@/sanity/lib/queries";
import ProjectMap from "@/app/components/ProjectMap";
import { Heading } from "@/app/components/ui/Heading";

export const metadata: Metadata = {
  title: "Where We Work — Looking Up Art",
  description: "Explore where Looking Up Art's projects are showing, have toured, and call home.",
};

export default async function MapPage() {
  const locations = await getMapLocations();

  return (
    <main>
      <div className="mx-auto w-full max-w-screen-2xl px-gutter pt-8 pb-6">
        <Heading level="h1" className="uppercase mb-2">Where We Work</Heading>
        <p className="max-w-2xl font-body text-base text-fg/70">
          Every place a Looking Up Art project is currently showing, has toured, or calls home.
        </p>
      </div>
      <div className="mx-auto w-full max-w-screen-2xl px-gutter pb-16">
        <ProjectMap locations={locations} />
      </div>
    </main>
  );
}
