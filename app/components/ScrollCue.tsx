"use client";

import { useEffect, useState } from "react";

// Full-bleed hero affordance: tells the viewer there's more below without
// shrinking the hero to leak the next section. Fades out on first scroll.
export default function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
        Scroll
      </span>
      <span className="h-8 w-px animate-pulse bg-white/70" />
    </div>
  );
}
