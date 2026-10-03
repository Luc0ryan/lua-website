import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/app/components/ui/Heading";

export const metadata: Metadata = {
  title: "About — Looking Up Art",
  description:
    "Looking Up Arts Foundation is a San Francisco-based non-profit dedicated to large scale art installations.",
};

const MISSION = [
  "Looking Up Arts Foundation is a San Francisco-based non-profit organization established in 2018 dedicated to large scale art installations. Looking Up supports local artists for the production, exhibition, and public dissemination of exciting and extraordinary art projects, focusing primarily on art festivals and interactive exhibitions.",
  "Looking Up focuses its support on installations that are fresh, ambitious, and interactive. Grants are given to projects that are typically large in scale, a specialized arena in which artists, designers, engineers, and tradespersons collaborate to make extraordinary, labor-intensive projects of love.",
];

// TODO: placeholder copy from the Figma comp (duplicates MISSION) — replace with the origin story.
const HOW_WE_STARTED = MISSION;

type Member = {
  name: string;
  role: string;
  /** Muted suffix after the role, e.g. "in Memoriam". */
  note?: string;
  image: string;
  /** Personal site / portfolio — shows the link badge on the photo. */
  href?: string;
};

const TEAM: Member[] = [
  { name: "Josh", role: "Co-founder, Board Officer, Creative Director", image: "/images/about/team/josh.png", href: "https://joshzubkoff.com" },
  { name: "Sri", role: "Co-founder, President, Artist", image: "/images/about/team/sri.png", href: "https://www.gutti.land" },
  { name: "Cody", role: "Co-founder, President;", note: "in Memoriam", image: "/images/about/team/cody.png" },
  { name: "Jewel", role: "Board Officer, Artist", image: "/images/about/team/jewel.jpg" },
  { name: "Leslie", role: "Business Development, Financial Officer", image: "/images/about/team/leslie.png" },
  { name: "Gayla", role: "Publications Chair, Board Officer", image: "/images/about/team/gayla.png" },
  { name: "Fonda", role: "Production Assistant, Artist", image: "/images/about/team/fonda.jpg" },
  { name: "Lori-Ann", role: "Project Management, Build Support", image: "/images/about/team/lori-ann.png" },
];

// TODO: placeholder rows from the Figma comp — replace with the real chronology.
const CHRONOLOGY = Array.from({ length: 4 }, () => ({
  year: "2025",
  name: "Radia Aurelia",
  location: "Tennessee",
  dates: "From August 2025 onward",
}));

function Story({
  title,
  paragraphs,
  image,
  alt,
  reverse = false,
}: {
  title: string;
  paragraphs: string[];
  image: string;
  alt: string;
  reverse?: boolean;
}) {
  return (
    <section className="grid items-start gap-10 md:grid-cols-2 md:gap-20">
      <div className={`flex flex-col gap-6 md:gap-9 ${reverse ? "md:order-2" : ""}`}>
        <Heading level="h2" weight="medium" className="text-fg">
          {title}
        </Heading>
        <div className="flex flex-col gap-6 font-sans text-lg md:text-xl text-black">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <div className="relative aspect-[497/492] overflow-hidden rounded-[2px] border-2 border-black">
        <Image src={image} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}

function TeamCard({ name, role, note, image, href }: Member) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[4px] border-[1.5px] border-black bg-white">
      <div className="relative aspect-square">
        <Image src={image} alt={name} fill sizes="(min-width: 1024px) 336px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}'s website`}
            className="absolute right-3.5 top-3.5 flex items-center rounded-[2px] border-2 border-black bg-white p-2"
          >
            <Image src="/images/about/link.svg" alt="" width={20} height={20.5559} />
          </a>
        )}
      </div>
      <div className="flex flex-col gap-1 border-t-[1.5px] border-black p-3 text-black">
        <p className="font-heading text-[32px] font-semibold leading-tight tracking-[-0.02em]">{name}</p>
        <p className="font-heading text-base font-medium tracking-[-0.02em]">
          {role}
          {note && <span className="text-text-muted"> {note}</span>}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Full-bleed hero sits under the fixed nav, same as the commission page. */}
      <div className="relative -mt-28 h-[clamp(420px,55vw,700px)] w-full">
        <Image
          src="/images/about/hero.jpg"
          alt="People climbing a large geodesic art installation on the playa"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={90}
        />
      </div>

      <div className="px-gutter">
        <div className="mx-auto w-full max-w-[1040px]">
          {/* Title card straddles the bottom edge of the hero. */}
          <div className="relative z-10 -mt-12 md:-mt-[59px] inline-flex border-2 border-fg bg-white p-4 md:p-6">
            <Heading as="h1" level="display" weight="medium" className="text-fg">
              ABOUT US
            </Heading>
          </div>

          <div className="flex flex-col gap-24 pt-16 pb-24 md:gap-30">
            <Story
              title="OUR MISSION"
              paragraphs={MISSION}
              image="/images/about/mission.jpg"
              alt="Josh and Sri building an installation"
            />
            <Story
              title="HOW WE STARTED"
              paragraphs={HOW_WE_STARTED}
              image="/images/about/started.jpg"
              alt="The Looking Up crew sharing a meal around a long table"
              reverse
            />

            <section className="flex flex-col gap-6">
              <Heading level="h2" weight="medium" className="text-fg">
                THE TEAM
              </Heading>
              <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {TEAM.map((m) => (
                  <TeamCard key={m.name} {...m} />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-10">
              <Heading level="h2" weight="medium" className="text-fg">
                CHRONOLOGY
              </Heading>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left">
                  <thead className="font-heading text-2xl font-medium tracking-[-0.02em]">
                    <tr>
                      <th className="pb-5 font-medium">Year</th>
                      <th className="pb-5 font-medium">Name</th>
                      <th className="pb-5 font-medium">Location</th>
                      <th className="pb-5 font-medium">Dates</th>
                    </tr>
                  </thead>
                  <tbody className="font-sans text-lg md:text-xl text-black">
                    {CHRONOLOGY.map((row, i) => (
                      <tr key={i}>
                        <td className="py-1.5 pr-6 w-[12%]">{row.year}</td>
                        <td className="py-1.5 pr-6 w-[25%]">{row.name}</td>
                        <td className="py-1.5 pr-6 w-[41%]">{row.location}</td>
                        <td className="py-1.5 whitespace-nowrap">{row.dates}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      <section className="bg-pink text-white">
        <div className="px-gutter py-16 md:py-12">
          <div className="mx-auto w-full max-w-[1040px]">
            <Link href="/contact" className="group inline-flex flex-col gap-10 font-heading font-medium tracking-[-0.025em]">
              <span className="text-[clamp(2rem,5vw,4rem)] leading-tight">
                Want to bring public art
                <br />
                to your space ?
              </span>
              <span className="font-normal text-[clamp(1.5rem,3vw,2.5rem)]">
                reach out to us{" "}
                <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
