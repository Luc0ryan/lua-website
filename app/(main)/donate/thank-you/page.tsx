import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/app/components/ui/Heading";

export const metadata: Metadata = {
  title: "Thank You — Looking Up Art",
  description: "Your donation has been received. Thank you for supporting Looking Up Art.",
};

const linkClass =
  "border-2 border-fg px-5 py-3 font-sans text-lg text-center transition-colors";

export default function ThankYouPage() {
  return (
    <section className="relative -mt-28 flex-1">
      <div className="relative h-[45svh] min-h-[320px] w-full lg:absolute lg:inset-0 lg:h-auto">
        <Image
          src="/images/donate/hero.jpg"
          alt="Sirsasana, a tall wooden lattice sculpture with teal fabric canopies, on the playa at Black Rock City"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[62%_center]"
        />
      </div>

      <div className="relative mx-auto w-full max-w-screen-2xl px-gutter pb-20 lg:grid lg:min-h-svh lg:grid-cols-2 lg:items-center lg:pt-28 lg:pb-16">
        <div className="relative z-10 -mt-24 mx-auto w-full max-w-[460px] border-2 border-fg bg-white p-6 md:p-8 lg:mt-0">
          <Heading as="h1" level="display" weight="medium" className="text-fg">
            THANK YOU
          </Heading>
          <p className="mt-4 font-sans text-lg text-fg">
            Your gift is on its way to artists and the work they&apos;re building. A
            receipt is headed to your inbox.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/projects" className={`${linkClass} bg-fg text-bg hover:bg-lua-pink hover:border-lua-pink`}>
              See the work
            </Link>
            <a
              href="https://www.instagram.com/lookinguparts/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} bg-white text-fg hover:bg-footer-bg`}
            >
              Follow along on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
