import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// "IMAGINATION IS OUR CRAFT" editorial block — Figma node 1140:1591.
// Title over a body/CTA row over a four-tile mosaic. The first tile keeps the
// real photo; the rest are gray placeholders until schema wiring lands.
export default function Editorial() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-gutter py-10">
      <div className="flex flex-col gap-10">
        <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-normal uppercase leading-none text-fg">
          Imagination is our craft
        </h2>

        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[687px] font-body text-xl leading-normal text-fg">
            We don&rsquo;t think any project has a single right answer. The work gets better when
            more people have a hand in it, so we leave room in almost everything we build for someone
            else to step in and make it theirs.
            <br />
            <br />
            Whatever we&rsquo;re making and wherever it ends up, the care is the same.
          </p>
          <Link
            href="/design"
            className="group inline-flex shrink-0 items-center gap-2.5 font-heading text-2xl font-semibold text-fg transition-colors duration-150 hover:text-pink focus-visible:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
          >
            See how it&rsquo;s made
            <ArrowRight
              size={24}
              strokeWidth={2.25}
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {/* Mosaic: big feature (real) | tall narrow | two stacked squares — ~2:1:1 columns.
            The feature column owns an explicit aspect-ratio, so the fill image always
            has a definite height from its own width — never borrowed from grid tracks
            (which can collapse to 0). The other columns stretch to match its height. */}
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
          <div className="relative aspect-square overflow-hidden rounded-[2px] bg-neutral-200">
            <Image
              src="/images/homeEditorial.webp"
              alt="Editorial photo"
              fill
              sizes="(max-width: 768px) 50vw, 512px"
              className="object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[2px] bg-neutral-300" />
          <div className="grid grid-rows-2 gap-4">
            <div className="overflow-hidden rounded-[2px] bg-neutral-300" />
            <div className="overflow-hidden rounded-[2px] bg-neutral-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
