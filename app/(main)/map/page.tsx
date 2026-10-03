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
    <main className="relative h-svh w-full overflow-hidden">
      <ProjectMap locations={locations} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto w-full max-w-screen-2xl px-gutter pt-8">
        <Heading
          level="h1"
          className="pointer-events-auto inline-block bg-white px-5 py-4 uppercase shadow-[inset_0_0_0_2px_var(--fg)]"
        >
          Where We Work
        </Heading>
      </div>
    </main>
  );
}
