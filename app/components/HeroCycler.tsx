"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import type { HeroProject } from "@/lib/heroProjects";

const CYCLE_MS = 6500;

const HEADLINE =
  "Looking Up Art is a San Francisco based art firm building interactive art that brings people together";

const doorLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Commission", href: "/commission" },
];

type Props = { projects: HeroProject[] };

export default function HeroCycler({ projects }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const loadedRef = useRef<Set<number>>(new Set());
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Decorative: gate auto-advance on decoded frames so the crossfade never
  // reveals a half-loaded image.
  const markLoaded = useCallback((i: number) => {
    loadedRef.current.add(i);
  }, []);

  // Picking a dot jumps there and pauses briefly, then resumes.
  const select = useCallback((i: number) => {
    setIndex(i);
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), 30_000);
  }, []);

  useEffect(() => () => { if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current); }, []);

  // Auto-advance, paused under reduced-motion, a hidden tab, or manual select.
  useEffect(() => {
    if (paused || projects.length < 2) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let id: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
    };
    const start = () => {
      stop();
      if (mq.matches) return;
      id = setInterval(() => {
        if (document.hidden) return;
        setIndex((cur) => {
          for (let step = 1; step < projects.length; step++) {
            const next = (cur + step) % projects.length;
            if (loadedRef.current.has(next)) return next;
          }
          return cur;
        });
      }, CYCLE_MS);
    };

    start();
    mq.addEventListener("change", start);
    return () => {
      stop();
      mq.removeEventListener("change", start);
    };
  }, [paused, projects.length]);

  if (!projects.length) return null;
  const active = projects[index];

  return (
    <section className="relative -mt-2 flex h-[90svh] flex-col justify-end overflow-hidden">
      {/* Cycling background — layered crossfade */}
      <div className="absolute inset-0">
        {projects.map((p, i) => (
          <Image
            key={p.key}
            src={urlFor(p.image).url()}
            alt=""
            fill
            sizes="100vw"
            preload={i === 0}
            loading={i === 0 ? undefined : "eager"}
            onLoad={() => markLoaded(i)}
            className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Top scrim — just enough to keep nav chrome readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 16%)",
        }}
      />

      {/* Bottom-left text scrim — three low-opacity layers composited so no single layer reads as an overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            // spot: concentrated behind text block
            "radial-gradient(ellipse 55% 70% at 0% 100%, rgba(0,0,0,.24) 0%, transparent 100%)",
            // edge: left-column darkening
            "linear-gradient(to right, rgba(0,0,0,.14) 0%, rgba(0,0,0,.10) 15%, rgba(0,0,0,.06) 30%, transparent 50%)",
            // base: eased bottom scrim across full width — lightened so brighter
            // slides don't blow out; still dark enough for nav/card legibility
            "linear-gradient(to top, rgba(0,0,0,.20) 0%, rgba(0,0,0,.18) 8%, rgba(0,0,0,.15) 15%, rgba(0,0,0,.12) 23%, rgba(0,0,0,.08) 31%, rgba(0,0,0,.05) 40%, rgba(0,0,0,.02) 52%, transparent 65%)",
          ].join(", "),
        }}
      />

      {/* Foreground content, anchored to the bottom of the stage */}
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-gutter pb-[clamp(1.5rem,4vw,3rem)] pt-28 md:flex-row md:items-end md:justify-between">
        {/* Bottom-left: tagline + door links */}
        <div className="max-w-2xl">
          <h1
            className="font-heading font-bold leading-[1.05] text-white [text-wrap:balance]"
            style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)" }}
          >
            {HEADLINE}
          </h1>

          <nav
            aria-label="Browse"
            className="relative mt-5 flex flex-wrap items-center gap-x-7 gap-y-2"
          >
            {doorLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="group inline-flex items-center gap-1.5 font-heading font-semibold text-white transition-colors duration-150 hover:text-pink focus-visible:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
              >
                {label}
                <ArrowRight
                  size={26}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom-right: dots card stacked above the project card */}
        <div className="hidden md:flex shrink-0 flex-col items-end gap-3 md:self-end">
          {/* Pagination dots — own card, 2px stroke, no drop shadow (subordinate
              to the title card below it) */}
          {projects.length > 1 && (
            <div
              role="group"
              aria-label="Featured projects"
              className="inline-flex items-center bg-white px-2 py-1 shadow-[inset_0_0_0_2px_var(--fg)]"
            >
              {projects.map((p, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => select(i)}
                    aria-label={p.title}
                    aria-current={isActive ? "true" : undefined}
                    className="group inline-flex items-center justify-center p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
                  >
                    <span
                      className={`block h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                        isActive
                          ? "bg-fg"
                          : "border-2 border-fg group-hover:border-fg"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Project card — stroke + solid drop shadow */}
          <div
            key={index}
            className="inline-block bg-white px-5 py-4 shadow-[inset_0_0_0_2px_var(--fg),4px_4px_0_var(--fg)] motion-safe:[animation:hero-card-in_550ms_cubic-bezier(0.22,1,0.36,1)_100ms_both]"
          >
            {active.meta && (
              <span className="block font-sans text-[13px] font-semibold uppercase tracking-widest text-gray-label">
                {active.meta}
              </span>
            )}
            <span className="mt-0.5 block font-heading font-normal leading-tight text-black text-[28px]">
              {active.title}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
