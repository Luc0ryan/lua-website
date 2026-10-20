import type { Metadata } from "next";
import { getMapLocations } from "@/sanity/lib/queries";
import MapExplorer from "@/app/components/MapExplorer";

export const metadata: Metadata = {
  title: "Where We Work — Looking Up Arts",
  description: "Explore where Looking Up Arts' projects are showing, have toured, and call home.",
};

export default async function MapPage() {
  const locations = await getMapLocations();

  return <MapExplorer locations={locations} />;
}
