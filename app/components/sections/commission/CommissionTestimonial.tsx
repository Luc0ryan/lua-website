import Image from "next/image";
import { Quote } from "lucide-react";

export default function CommissionTestimonial() {
  return (
    <section className="relative aspect-[3/4] max-h-[640px] w-full sm:aspect-[16/9] md:aspect-[21/9]">
      <Image
        src="/images/commission/testimonial-bg.jpg"
        alt="Wabash Lights, a neon-illuminated pedestrian underpass in Chicago"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto flex w-full max-w-screen-2xl justify-end px-gutter pb-8 md:pb-12">
          <div className="max-w-[49.75rem] border-2 border-fg bg-white p-8 shadow-[4px_4px_0_var(--fg)]">
            <p className="font-sans font-medium text-lg md:text-xl text-fg">
              To put it simply, without Looking Up Arts The Wabash Lights would
              have never happened – they took our vision and turned it into
              reality; first by being open to the challenge, and then being
              rigorous in their testing, comprehensive in their design, and
              creative in their approach. We are thrilled with both the
              collaboration and how the project has turned out.
            </p>
            <div className="mt-6 flex items-start gap-2">
              <Quote className="mt-1 shrink-0 text-purple-commission" size={20} aria-hidden="true" />
              <div className="font-sans text-lg text-fg">
                <p>Jack C. Newell</p>
                <p>co-founder The Wabash Lights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
