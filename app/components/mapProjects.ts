import type { MapLocation } from "@/sanity/lib/queries";

export type MapProject = {
  id: string;
  title: string;
  slug?: string;
  placement?: MapLocation["project"]["placement"];
  image?: MapLocation["project"]["image"];
  /** The stop that gets the pin: the current location, else the latest past one. */
  primary: MapLocation;
  /** True when no stop is current, so `primary` is the last one we know of. */
  isLastKnown: boolean;
  /** Every other stop, newest first. Revealed when the project is selected. */
  past: MapLocation[];
};

// A current stop with no year still outranks a dated past one.
const UNDATED_CURRENT = 9999;

function recency(loc: MapLocation): number {
  return loc.year ?? (loc.locationState === "current" ? UNDATED_CURRENT : 0);
}

/** One entry per project, newest first. */
export function groupProjects(locations: MapLocation[]): MapProject[] {
  const byProject = new Map<string, MapLocation[]>();
  for (const loc of locations) {
    if (!loc.project?._id) continue;
    const group = byProject.get(loc.project._id);
    if (group) group.push(loc);
    else byProject.set(loc.project._id, [loc]);
  }

  const projects: MapProject[] = [];
  byProject.forEach((stops, id) => {
    const ordered = [...stops].sort((a, b) => recency(b) - recency(a));
    const primary = ordered.find((l) => l.locationState === "current") ?? ordered[0];
    const { project } = primary;
    projects.push({
      id,
      title: project.title,
      slug: project.slug,
      placement: project.placement,
      image: project.image,
      primary,
      isLastKnown: primary.locationState !== "current",
      past: ordered.filter((l) => l._id !== primary._id),
    });
  });

  return projects.sort(
    (a, b) => recency(b.primary) - recency(a.primary) || a.title.localeCompare(b.title)
  );
}

export function stopLabel(loc: MapLocation): string {
  return [loc.venueName, loc.city].filter(Boolean).join(" · ");
}
