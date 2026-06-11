// DEPRECATED — replaced by HeroStage, kept for reference
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DotPanel } from "../dot-system";
import MarqueeStrip from "../MarqueeStrip";
import { getHeroProjects } from "@/lib/heroProjects";

// THESIS LINE — pending
const HEADLINE = { lead: "We make you", highlight: "look up" };
const SUBLINE =
  "Interactive public art, built in San Francisco to bring people together.";

const doorLinks = [
  { label: "Projects", href: "/artworks", accent: false },
  { label: "Catalogue", href: "/catalogue", accent: false }, // TODO page: route not built yet
  { label: "Work with us", href: "/work-with-us", accent: true }, // TODO page: route not built yet
];

export default async function HeroMarquee() {
  const projects = await getHeroProjects();

  return (
    // relative makes this the positioning context for the dot layer
    <div className="relative flex min-h-[100svh] flex-col pb-8">
      <DotPanel
        shape="peak"
        intensityRange={[0, 1]}
        dotColor="#DC738F"
        opacity={0.15}
        className="absolute inset-0"
      />

      {/* Headline zone — dominant (~55%) */}
      <section className="relative w-full max-w-screen-2xl mx-auto px-gutter pt-28 flex-55 flex flex-col justify-center min-h-0">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-black leading-tight">
          {HEADLINE.lead} <span className="text-pink">{HEADLINE.highlight}</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg md:text-xl font-body text-fg/70">
          {SUBLINE}
        </p>

        {/* Door links — reading order ends on the accented terminus */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          {doorLinks.map(({ label, href, accent }) => (
            <Link
              key={label}
              href={href}
              className={`group inline-flex items-center gap-1.5 text-lg md:text-xl font-heading font-medium hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink ${
                accent ? "text-pink" : "text-fg"
              }`}
            >
              {label}
              <ArrowRight
                size={20}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Project strip zone (~45%) — full-bleed so frames clip at both edges */}
      <div className="relative flex-45 flex items-center min-h-0 mt-8">
        <MarqueeStrip projects={projects} />
      </div>
    </div>
  );
}
