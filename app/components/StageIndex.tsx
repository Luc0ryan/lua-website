"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import type { HeroProject } from "@/lib/heroProjects";

const CYCLE_MS = 7000;

type Props = { projects: HeroProject[] };

export default function StageIndex({ projects }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [requested, setRequested] = useState(0);
  const [committed, setCommitted] = useState(0);
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(new Set());
  const loadedRef = useRef<ReadonlySet<number>>(new Set());
  const [stopped, setStopped] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastPointerTypeRef = useRef("");

  const markLoaded = useCallback((i: number) => {
    setLoaded((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      loadedRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (requested !== committed && loaded.has(requested)) {
      setCommitted(requested);
    }
  }, [requested, committed, loaded]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Any interaction with the hero kills the auto-cycle for the session.
  useEffect(() => {
    const hero = rootRef.current?.closest("[data-hero-root]") ?? rootRef.current;
    if (!hero) return;
    const stop = () => setStopped(true);
    const events = ["pointerdown", "pointerenter", "pointermove", "focusin", "touchstart"] as const;
    for (const name of events) hero.addEventListener(name, stop, { once: true, passive: true });
    return () => { for (const name of events) hero.removeEventListener(name, stop); };
  }, []);

  useEffect(() => {
    if (stopped || reducedMotion || projects.length < 2) return;
    const id = setInterval(() => {
      setRequested((cur) => {
        for (let step = 1; step < projects.length; step++) {
          const next = (cur + step) % projects.length;
          if (loadedRef.current.has(next)) return next;
        }
        return cur;
      });
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [stopped, reducedMotion, projects.length]);

  if (!projects.length) return null;
  const active = projects[committed];

  return (
    <div
      ref={rootRef}
      className="flex h-full flex-col gap-6 md:flex-row md:gap-8"
      onPointerDownCapture={(e) => { lastPointerTypeRef.current = e.pointerType; }}
      onKeyDownCapture={() => { lastPointerTypeRef.current = ""; }}
    >
      {/* Stage with hard offset shadow */}
      <div className="relative aspect-3/2 w-full md:h-full md:w-auto md:max-w-[66%] md:shrink-0">
        <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xs bg-fg" aria-hidden="true" />
        <Link
          href={active.href}
          aria-label={`View ${active.title}`}
          className="relative block h-full w-full overflow-hidden rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
        >
          {projects.map((p, i) => (
            <Image
              key={p.key}
              src={urlFor(p.image).url()}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              preload={i === 0}
              loading={i === 0 ? undefined : "eager"}
              onLoad={() => markLoaded(i)}
              className={`object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                i === committed ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </Link>
      </div>

      {/* Project index */}
      <nav aria-label="Featured projects" className="flex min-h-0 flex-1 flex-col justify-start">
        <ul className="flex flex-col">
          {projects.map((p, i) => {
            const isActive = i === requested;
            return (
              <li key={p.key}>
                {i > 0 && <hr className="border-fg/10" />}
                <Link
                  href={p.href}
                  aria-current={isActive ? "true" : undefined}
                  onPointerEnter={(e) => { if (e.pointerType !== "touch") setRequested(i); }}
                  onFocus={() => { if (lastPointerTypeRef.current !== "touch") setRequested(i); }}
                  onClick={(e) => {
                    if (lastPointerTypeRef.current === "touch" && i !== requested) {
                      e.preventDefault();
                      setRequested(i);
                    }
                  }}
                  className="block py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                >
                  {/* Pink border lives only on the content div, not across the divider */}
                  <div
                    className={`px-3 border-l-[3px] transition-colors duration-200 ${
                      isActive ? "border-pink" : "border-transparent"
                    }`}
                  >
                    {p.meta && (
                      <span
                        className="block font-body uppercase tracking-wide text-gray-label"
                        style={{ fontSize: "clamp(0.75rem, 1.25vw, 1.25rem)" }}
                      >
                        {p.meta}
                      </span>
                    )}
                    <span
                      className={`block font-heading font-semibold uppercase leading-tight transition-colors duration-200 ${
                        isActive ? "text-fg" : "text-fg/50 hover:text-fg/80"
                      }`}
                      style={{ fontSize: "clamp(1.125rem, 2.5vw, 2rem)" }}
                    >
                      {p.title}
                    </span>
                    {isActive && (
                      <span className="mt-0.5 flex items-center gap-1 font-heading text-sm font-medium text-pink md:hidden">
                        View project
                        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
