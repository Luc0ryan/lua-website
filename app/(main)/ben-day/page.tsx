import type { Metadata } from "next";
import { DotField } from "@/app/components/dot-system";
import { Heading } from "@/app/components/ui/Heading";

export const metadata: Metadata = {
  title: "Ben-Day Dot System — Looking Up Arts",
  robots: { index: false, follow: false },
};

function DotSwatch({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-xl overflow-hidden bg-white border border-fg/10 aspect-[4/3]">
        {children}
      </div>
      <div>
        <p className="font-sans font-bold text-lg">{label}</p>
        <p className="font-body text-fg/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function BenDayPage() {
  return (
    <main className="px-gutter py-20 md:py-32 max-w-6xl mx-auto w-full">
      <header className="max-w-2xl mb-16">
        <p className="font-sans text-xs font-semibold tracking-widest uppercase text-pink mb-3">
          Design system
        </p>
        <Heading level="h1" className="leading-tight mb-4">
          Dot variants
        </Heading>
        <p className="font-body text-fg/60 text-lg leading-relaxed">
          Three models drawn from print history — Ben-Day, Halftone, and
          Screentone — each available as a drop-in{" "}
          <code className="font-mono text-sm bg-fg/5 px-1.5 py-0.5 rounded">
            variant
          </code>{" "}
          on{" "}
          <code className="font-mono text-sm bg-fg/5 px-1.5 py-0.5 rounded">
            &lt;DotField&gt;
          </code>
          .
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Ben-Day */}
        <DotSwatch
          label="Ben-Day"
          description="Uniform dots on a 45° rotated square grid. Roy Lichtenstein's signature — flat, mechanical, no gradation."
        >
          <div className="absolute inset-0 blur-[1.5px]">
            <DotField
              variant="ben-day"
              dotColor="#DC738F"
              intensity={0.72}
              spacing={8}
              opacity={1}
              angle={45}
            />
          </div>
        </DotSwatch>

        {/* Halftone */}
        <DotSwatch
          label="Halftone"
          description="Same grid with a built-in gradient mask — dense at the top, dissolving to nothing at the bottom. Simulates offset-print tonal gradation."
        >
          <DotField
            variant="halftone"
            dotColor="#1a1a1a"
            intensity={0.65}
            spacing={14}
            opacity={1}
            angle={45}
          />
        </DotSwatch>

        {/* Screentone */}
        <DotSwatch
          label="Screentone"
          description="Brick-offset hex arrangement — alternate rows staggered by half a pitch. The standard manga fill pattern; denser and more even than a square grid."
        >
          <DotField
            variant="screentone"
            dotColor="#1a1a1a"
            intensity={0.5}
            spacing={12}
            opacity={1}
          />
        </DotSwatch>
      </div>

      {/* Usage reference */}
      <section className="mt-24">
        <Heading as="h2" level="h3" className="mb-6">Usage</Heading>
        <pre className="font-mono text-sm bg-fg/5 rounded-xl p-6 overflow-x-auto leading-relaxed text-fg/80">{`// Ben-Day — uniform rotated grid
<DotField variant="ben-day" dotColor="#DC738F" intensity={0.55} angle={45} />

// Halftone — dot grid with built-in top→bottom fade
<DotField variant="halftone" dotColor="#1a1a1a" intensity={0.65} angle={45} />

// Screentone — brick-offset hex grid
<DotField variant="screentone" dotColor="#1a1a1a" intensity={0.5} spacing={12} />

// Wrap in DotPanel to add an external MaskShape on top
<DotPanel variant="halftone" shape="radial-edges" intensityRange={[0, 0.8]} />`}</pre>
      </section>
    </main>
  );
}
