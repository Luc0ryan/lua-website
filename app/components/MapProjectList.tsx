"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { stopLabel, type MapProject } from "./mapProjects";

type Props = {
  projects: MapProject[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onShowAll: () => void;
};

export default function MapProjectList({ projects, activeId, onSelect, onHover, onShowAll }: Props) {
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  // A pin click on the map should bring its row into view.
  useEffect(() => {
    if (!activeId) return;
    itemRefs.current.get(activeId)?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeId]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-start gap-3 p-6">
        <p className="font-body text-sm text-fg/70">No projects in this part of the map.</p>
        <button
          type="button"
          onClick={onShowAll}
          className="cursor-pointer font-body text-sm font-semibold underline underline-offset-4 hover:text-pink"
        >
          Show all projects
        </button>
      </div>
    );
  }

  return (
    <ul className="flex snap-x gap-0 overflow-x-auto md:block md:flex-1 md:snap-none md:overflow-y-auto md:overflow-x-hidden">
      {projects.map((project) => {
        const active = project.id === activeId;
        const { primary } = project;
        const imgUrl = project.image ? urlFor(project.image).url() : null;
        const eyebrow = primary.city ?? primary.venueName;
        const pastCount = project.past.length;

        return (
          <li
            key={project.id}
            ref={(node) => {
              if (node) itemRefs.current.set(project.id, node);
              else itemRefs.current.delete(project.id);
            }}
            onMouseEnter={() => onHover(project.id)}
            onMouseLeave={() => onHover(null)}
            className={`w-[17.5rem] shrink-0 snap-start border-fg max-md:border-r-2 md:w-full md:border-b-2 ${
              active ? "bg-pink-fill" : "bg-white"
            }`}
          >
            <div className="relative">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(active ? null : project.id)}
                onFocus={() => onHover(project.id)}
                onBlur={() => onHover(null)}
                className="group flex w-full cursor-pointer text-left"
              >
                <span className="relative w-24 shrink-0 self-stretch overflow-hidden bg-neutral-200 md:w-28">
                  {imgUrl && (
                    <Image
                      src={imgUrl}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1 px-4 pt-3 pb-10">
                  {eyebrow && (
                    <span className="font-body text-xs uppercase leading-snug tracking-wide text-fg/50">
                      {eyebrow}
                    </span>
                  )}
                  <span className="font-heading text-base font-bold uppercase leading-tight text-fg">
                    {project.title}
                  </span>
                </span>
              </button>

              {project.slug && (
                <Link
                  href={`/projects/${project.slug}`}
                  className="absolute bottom-3 left-[7rem] flex items-center gap-1 font-body text-sm font-semibold text-fg hover:text-pink md:left-[8rem]"
                >
                  Learn more <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </Link>
              )}
              {pastCount > 0 && !active && (
                <span className="pointer-events-none absolute right-4 bottom-3 font-body text-xs text-fg/50">
                  +{pastCount} past {pastCount === 1 ? "stop" : "stops"}
                </span>
              )}
            </div>

            {active && pastCount > 0 && (
              <div className="hidden border-t border-fg/15 px-4 py-3 md:block">
                <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-fg/50">
                  Past stops
                </p>
                <ul className="flex flex-col gap-1.5">
                  {project.past.map((stop) => (
                    <li key={stop._id} className="flex justify-between gap-3 font-body text-sm text-fg">
                      <span className="min-w-0 truncate">{stopLabel(stop) || "Unnamed stop"}</span>
                      {stop.year != null && <span className="shrink-0 text-fg/60">{stop.year}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
