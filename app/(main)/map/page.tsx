import type { Metadata } from "next";
import { getMapLocations } from "@/sanity/lib/queries";
import ProjectMap from "@/app/components/ProjectMap";

export const metadata: Metadata = {
  title: "Where We Work — Looking Up Art",
  description: "Explore where Looking Up Art's projects are showing, have toured, and call home.",
};

export default async function MapPage() {
  const locations = await getMapLocations();

  return (
    <main>
      <div className="mx-auto w-full max-w-screen-2xl px-gutter pt-8 pb-6">
        <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase mb-2">Where We Work</h1>
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
