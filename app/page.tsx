import Link from "next/link";
import Image from "next/image";
import Nav from "./components/Nav";
import HeroAccordion from "./components/HeroAccordion";
import Footer from "./components/Footer";
import { getFeaturedArtworks, getAllArtworks } from "../sanity/lib/queries";
import { urlFor } from "../sanity/lib/image";

async function ProjectGrid() {
  const artworks = await getAllArtworks().catch(() => []);
  const displayed = artworks.slice(0, 6);

  if (!displayed.length) return null;

  const rows: Array<{ items: typeof displayed; cols: string }> = [
    { items: displayed.slice(0, 1), cols: "grid-cols-1" },
    { items: displayed.slice(1, 3), cols: "grid-cols-2" },
    { items: displayed.slice(3, 6), cols: "grid-cols-3" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-8 py-16 space-y-4">
      {rows.map((row, ri) => (
        <div key={ri} className={`grid ${row.cols} gap-4`}>
          {row.items.map((aw) => {
            const src = aw.image
              ? urlFor(aw.image).width(800).height(600).fit("crop").url()
              : null;
            return (
              <div key={aw._id} className="group cursor-pointer">
                <div className="overflow-hidden bg-neutral-200 relative"
                  style={{ aspectRatio: "4/3" }}>
                  {src ? (
                    <Image
                      src={src}
                      alt={aw.title ?? ""}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-300" />
                  )}
                </div>
                <p className="text-[10px] font-body uppercase tracking-widest text-[--color-gray-label] mt-3">
                  {aw.location}
                </p>
                <p className="text-base font-heading font-bold text-fg mt-0.5">{aw.title}</p>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}

const igCount = 8;

export default async function HomePage() {
  const featured = await getFeaturedArtworks().catch(() => []);

  return (
    <>
      <Nav />

      {/* Hero */}
      {featured.length > 0 ? (
        <HeroAccordion artworks={featured} />
      ) : (
        <div className="h-[90vh] min-h-[520px] bg-neutral-800 flex items-end p-12">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/60 font-body mb-2">
              Add featured artworks in Sanity Studio
            </p>
            <h1 className="text-5xl font-heading font-bold text-white leading-tight">
              Interactive art built to<br />
              bring <span className="text-[#E8197D]">people</span> together
            </h1>
          </div>
        </div>
      )}

      {/* Mid — editorial section */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div className="overflow-hidden bg-neutral-200 relative" style={{ aspectRatio: "4/3" }}>
          <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center">
            <span className="text-xs font-body text-neutral-500">Editorial photo</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-body font-medium text-[#E8197D] mb-4">// we build local</p>
          <h2 className="text-4xl font-heading font-bold text-fg leading-tight mb-6">
            Transforming public space with every project
          </h2>
          <p className="text-base font-body text-fg/60 leading-relaxed">
            Looking Up Arts is a nonprofit studio shaping public spaces through light, creativity,
            and hands-on collaboration. We work with communities and cities to build work that
            energizes and inspires connection.
          </p>
        </div>
      </section>

      {/* Project grid from Sanity */}
      <ProjectGrid />

      {/* Instagram grid — static placeholders */}
      <section className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: igCount }).map((_, i) => (
            <div
              key={i}
              className="bg-neutral-200 overflow-hidden relative"
              style={{ aspectRatio: "1" }}
            >
              <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center">
                <span className="text-xs font-body text-neutral-400">IG</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            href="https://www.instagram.com/lookinguparts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-body font-medium text-fg hover:text-[#E8197D] transition-colors"
          >
            Follow us on instagram →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
