import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StageIndex from "../StageIndex";
import { getHeroProjects } from "@/lib/heroProjects";

const HEADLINE = { lead: "We make you", highlight: "look up" };

const doorLinks = [
  { label: "Projects", href: "/artworks" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Commission", href: "/commission" },
];

export default async function HeroStage() {
  const projects = await getHeroProjects();

  return (
    <div
      className="grid pb-6"
      data-hero-root
    >
      {/* Headline */}
      <section className="w-full max-w-screen-2xl mx-auto px-gutter pt-6">
        <h1
          className="font-heading font-bold text-fg leading-tight"
          style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
        >
          {HEADLINE.lead} <span className="text-pink">{HEADLINE.highlight}</span>
        </h1>
      </section>

      {/* Door links — above the stage */}
      <div className="w-full max-w-screen-2xl mx-auto px-gutter mt-1 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-0">
        {doorLinks.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="group inline-flex items-center gap-1 font-heading font-semibold text-fg hover:text-pink active:text-pink transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
          >
            {label}
            <ArrowRight
              size={32}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        ))}
      </div>

      {/* Stage + index — takes all remaining viewport height */}
      <div className="min-h-0 mt-6 w-full max-w-screen-2xl mx-auto px-gutter">
        <StageIndex projects={projects} />
      </div>
    </div>
  );
}
