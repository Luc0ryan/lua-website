import Link from "next/link";
import type { CSSProperties } from "react";
import { DotField } from "./dot-system/DotField";

const cols = [
  {
    heading: "ABOUT",
    links: [],
  },
  {
    heading: "PROJECTS",
    links: [],
  },
  {
    heading: "COMMUNITY",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    heading: "SERVICES",
    links: [
      { label: "Store", href: "/store" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
];

const dotMask: CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  maskImage:
    "linear-gradient(to right, transparent 0%, transparent 45%, rgba(0,0,0,1) 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, transparent 45%, rgba(0,0,0,1) 100%)",
  pointerEvents: "none",
};

export default function Footer() {
  return (
    <footer className="bg-bg relative overflow-hidden pt-12 mt-auto">
      <div style={dotMask} aria-hidden="true">
        <DotField dotColor="#D4458A" intensity={0.3} spacing={15} opacity={0.35} angle={45} />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-gutter pt-12 pb-8">
        <div className="flex items-start justify-between gap-8 mb-12">
          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((col) => (
              <div key={col.heading}>
                <p className="text-sm font-sans font-semibold tracking-widest uppercase text-fg mb-3">
                  {col.heading}
                </p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm font-sans font-medium tracking-widest uppercase text-fg/60 hover:text-fg transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Us — pop art card */}
          <Link
            href="/contact"
            className="shrink-0 border-2 border-[#2B2B2B] bg-[#F2EFEA] px-7 py-6 min-w-55 shadow-[3px_3px_0px_#2B2B2B] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translatex-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#2B2B2B]"
          >
            <p className="font-sans font-bold text-[30px] leading-tight text-[#2B2B2B] uppercase mb-3">
              CONTACT US
            </p>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[15px] text-[#2B2B2B]/70">
                Interested in collaborating?
              </span>
              <span className="text-lg text-[#2B2B2B]">›</span>
            </div>
          </Link>
        </div>

        {/* Copyright */}
        <div className="border-t border-fg/15 pt-6">
          <p className="text-xs font-sans text-fg/40 uppercase tracking-widest">
            © 2026 LOOKING UP ARTS
          </p>
        </div>
      </div>
    </footer>
  );
}
