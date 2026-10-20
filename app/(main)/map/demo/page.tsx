import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import type { MapLocation } from "@/sanity/lib/queries";
import MapExplorer from "@/app/components/MapExplorer";

// Client-demo map with fixture locations. Does not read `location` documents
// and does not touch the Google Maps key, so it is independent of Studio
// editing. Reachable in `next dev`; in production only when MAP_DEMO=1.
// Remove this route once real locations are geocoded in Studio.
export const metadata: Metadata = {
  title: "Map Demo — Looking Up Arts",
  robots: { index: false, follow: false },
};

type Seed = Pick<MapLocation, "venueName" | "city" | "year" | "locationState"> & {
  lat: number;
  lng: number;
};

const SEEDS: Seed[] = [
  { venueName: "Upside Artspace", city: "Minneapolis, MN", year: 2025, locationState: "current", lat: 44.9778, lng: -93.265 },
  { venueName: "Millennium Park", city: "Chicago, IL", year: 2025, locationState: "current", lat: 41.8826, lng: -87.6226 },
  { venueName: "The Mission Library", city: "San Francisco, CA", year: 2025, locationState: "current", lat: 37.7599, lng: -122.4148 },
  { venueName: "Pioneer Square", city: "Seattle, WA", year: 2024, locationState: "current", lat: 47.6015, lng: -122.3343 },
  { venueName: "Zilker Park", city: "Austin, TX", year: 2024, locationState: "current", lat: 30.2669, lng: -97.7729 },
  { venueName: "Wynwood Walls", city: "Miami, FL", year: 2024, locationState: "past", lat: 25.8008, lng: -80.1994 },
  { venueName: "Fairmount Park", city: "Philadelphia, PA", year: 2023, locationState: "past", lat: 39.9496, lng: -75.1503 },
  { venueName: "Boston Public Garden", city: "Boston, MA", year: 2023, locationState: "past", lat: 42.3541, lng: -71.0711 },
  { venueName: "Civic Center Park", city: "Denver, CO", year: 2023, locationState: "past", lat: 39.7392, lng: -104.9903 },
  { venueName: "Piedmont Park", city: "Atlanta, GA", year: 2022, locationState: "past", lat: 33.7852, lng: -84.3738 },
  { venueName: "Griffith Observatory", city: "Los Angeles, CA", year: 2022, locationState: "past", lat: 34.1184, lng: -118.3004 },
  // Two close together so the clustering behaviour is visible in the demo.
  { venueName: "Brooklyn Bridge Park", city: "Brooklyn, NY", year: 2025, locationState: "current", lat: 40.7003, lng: -73.9967 },
  { venueName: "Hudson Yards", city: "New York, NY", year: 2022, locationState: "past", lat: 40.7536, lng: -74.0016 },
];

async function getDemoLocations(): Promise<MapLocation[]> {
  // Borrow real projects (title + image) so popups look like the finished map.
  const projects = await client.fetch<MapLocation["project"][]>(
    `*[_type == "project" && defined(image)]{ _id, title, "slug": slug.current, "image": image }`
  );
  if (projects.length === 0) return [];
  return SEEDS.map((s, i) => ({
    _id: `demo-${i}`,
    venueName: s.venueName,
    city: s.city,
    year: s.year,
    locationState: s.locationState,
    geopoint: { lat: s.lat, lng: s.lng },
    project: projects[i % projects.length],
  }));
}

export default async function MapDemoPage() {
  if (process.env.NODE_ENV === "production" && process.env.MAP_DEMO !== "1") notFound();
  const locations = await getDemoLocations();

  return <MapExplorer locations={locations} />;
}
