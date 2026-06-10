"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { HeroProject } from "@/lib/heroProjects";

const HOVER_SCROLL_PX_PER_FRAME = 4;
const CARD_SCROLL_STEP = 360; // ~one card + gap per click

type FrameProps = {
  project: HeroProject;
  eager: boolean;
};

function Frame({ project, eager }: FrameProps) {
  return (
    <Link
      href={project.href}
      className="group block w-[260px] md:w-[330px] shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-xs">
        <Image
          src={urlFor(project.image).fit("crop").url()}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 260px, 330px"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
        />
      </div>
      <p className="mt-2 text-sm font-body truncate">
        {project.meta && (
          <span className="text-gray-label">{project.meta} · </span>
        )}
        <span className="font-heading font-bold uppercase text-fg">
          {project.title}
        </span>
      </p>
    </Link>
  );
}

type Props = { projects: HeroProject[] };

export default function MarqueeStrip({ projects }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => {
      window.removeEventListener("resize", updateEdges);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateEdges]);

  const stopHoverScroll = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startHoverScroll = useCallback(
    (dir: 1 | -1) => {
      stopHoverScroll();
      const step = () => {
        const el = scrollerRef.current;
        if (el) el.scrollLeft += dir * HOVER_SCROLL_PX_PER_FRAME;
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [stopHoverScroll]
  );

  const scrollByCard = useCallback((dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * CARD_SCROLL_STEP,
      behavior: "smooth",
    });
  }, []);

  if (!projects.length) return null;

  return (
    <section aria-label="Featured projects" className="relative w-full">
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="no-scrollbar flex gap-6 overflow-x-auto px-gutter"
      >
        {projects.map((p, i) => (
          <Frame key={p.key} project={p} eager={i < 3} />
        ))}
      </div>

      {/* Edge navigation: hover to glide, click/Enter to step a card */}
      <button
        type="button"
        aria-label="Scroll projects left"
        onMouseEnter={() => startHoverScroll(-1)}
        onMouseLeave={stopHoverScroll}
        onClick={() => scrollByCard(-1)}
        className={`absolute left-0 top-0 bottom-0 w-14 hidden md:flex items-center justify-start pl-3 bg-linear-to-r from-bg to-transparent text-fg transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink ${
          canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ArrowLeft size={24} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Scroll projects right"
        onMouseEnter={() => startHoverScroll(1)}
        onMouseLeave={stopHoverScroll}
        onClick={() => scrollByCard(1)}
        className={`absolute right-0 top-0 bottom-0 w-14 hidden md:flex items-center justify-end pr-3 bg-linear-to-l from-bg to-transparent text-fg transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink ${
          canRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ArrowRight size={24} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </section>
  );
}
