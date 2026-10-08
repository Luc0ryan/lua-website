import type { Metadata } from "next";
import CommissionHero from "@/app/components/sections/commission/CommissionHero";
import CommissionHeading from "@/app/components/sections/commission/CommissionHeading";
import CommissionValueGrid from "@/app/components/sections/commission/CommissionValueGrid";
import CommissionOutlasts from "@/app/components/sections/commission/CommissionOutlasts";
import CommissionProcess from "@/app/components/sections/commission/CommissionProcess";
import CommissionTestimonial from "@/app/components/sections/commission/CommissionTestimonial";
import CommissionSelectedWorks from "@/app/components/sections/commission/CommissionSelectedWorks";
import CommissionFAQ from "@/app/components/sections/commission/CommissionFAQ";
import CommissionCTA from "@/app/components/sections/commission/CommissionCTA";

export const metadata: Metadata = {
  title: "Commission — Looking Up Arts",
  description:
    "Looking Up Arts works with civic institutions and private groups to build large-scale art that outlasts everyone.",
};

export default function CommissionPage() {
  return (
    <div className="flex-1 flex flex-col">
      <CommissionHero />
      {/* Single horizontal container for everything below the full-bleed hero image —
          the only place page content declares max-w/px-gutter, so nothing downstream
          can drift out of alignment with it. Breaks only for the full-bleed testimonial. */}
      <div className="mx-auto w-full max-w-screen-2xl px-gutter">
        <CommissionHeading />
        <CommissionValueGrid />
        <CommissionOutlasts />
        <CommissionProcess />
      </div>
      <CommissionTestimonial />
      <div className="mx-auto w-full max-w-screen-2xl px-gutter">
        <CommissionSelectedWorks />
        <CommissionFAQ />
        <CommissionCTA />
      </div>
    </div>
  );
}
