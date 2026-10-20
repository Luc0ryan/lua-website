"use client";

import { useMemo, useState } from "react";
import type { MapLocation } from "@/sanity/lib/queries";
import ProjectMap from "./ProjectMap";
import MapProjectList from "./MapProjectList";
import { Heading } from "./ui/Heading";
import { groupProjects } from "./mapProjects";

// Sidebar list + map. One pin and one row per project; selecting a project
// (row or pin) reveals its earlier stops on the map. The list follows the
// map: it shows only projects whose pin is in view, newest first.
export default function MapExplorer({ locations }: { locations: MapLocation[] }) {
  const projects = useMemo(() => groupProjects(locations), [locations]);
  const pins = useMemo(() => projects.map((p) => p.primary), [projects]);

  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [fitSignal, setFitSignal] = useState(0);

  const pastStops = useMemo(
    () => (activeId ? projects.find((p) => p.id === activeId)?.past : undefined),
    [projects, activeId]
  );

  const listed = useMemo(() => {
    if (!visibleIds) return projects;
    const visible = new Set(visibleIds);
    return projects.filter((p) => visible.has(p.id) || p.id === activeId);
  }, [projects, visibleIds, activeId]);

  return (
    <main className="relative -mt-28 flex h-svh w-full flex-col overflow-hidden md:flex-row">
      <aside className="order-2 flex min-h-0 shrink-0 flex-col border-t-2 border-fg bg-white md:order-1 md:w-[23rem] md:border-t-0 md:border-r-2">
        {/* Desktop: sits beside the nav logo (the nav floats over this corner),
            so it matches the nav's height and clears the logo's width. */}
        <div className="flex shrink-0 items-center border-b-2 border-fg py-3 pr-gutter pl-gutter md:h-28 md:py-0 md:pr-4 md:pl-[calc(var(--gutter)+6rem)]">
          <Heading level="h4" weight="bold" className="uppercase leading-tight">
            Where we work
          </Heading>
        </div>
        <MapProjectList
          projects={listed}
          activeId={activeId}
          onSelect={setActiveId}
          onHover={setHoveredId}
          onShowAll={() => {
            setActiveId(null);
            setFitSignal((n) => n + 1);
          }}
        />
      </aside>

      <div className="relative order-1 min-h-0 flex-1 md:order-2">
        <ProjectMap
          locations={pins}
          pastStops={pastStops}
          activeProjectId={activeId}
          hoveredProjectId={hoveredId}
          onActiveProjectChange={setActiveId}
          onVisibleProjectsChange={setVisibleIds}
          fitSignal={fitSignal}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </main>
  );
}
