import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getArtworkBySlug, getRelatedArtworks, type Artwork } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { buildGalleryRows } from "./buildGalleryRows";
import RelatedWorks from "./RelatedWorks";
import { Heading } from "@/app/components/ui/Heading";

type Props = { params: Promise<{ slug: string }> };

const sectionBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 text-fg transition-colors hover:text-fg/70"
      >
        {children}
      </a>
    ),
  },
};

// Same rule as the gallery card overlay: touring → "Touring";
// permanent/exhibition → "city · year".
function subtitleLine(artwork: Artwork): string {
  if (artwork.placement === "touring") return "Touring";
  return [artwork.city, artwork.year].filter(Boolean).join(" · ");
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) notFound();

  const related = await getRelatedArtworks(artwork._id, artwork.placement);

  const heroUrl = artwork.image ? urlFor(artwork.image).url() : null;
  const subtitle = subtitleLine(artwork);
  const canBook = artwork.status !== "retired";
  const contactHref = `/contact?piece=${encodeURIComponent(
    artwork.slug?.current ?? slug
  )}&title=${encodeURIComponent(artwork.title)}`;

  const metadata = [
    { label: "Year", value: artwork.year },
    { label: "Footprint", value: artwork.footprint },
    { label: "Typology", value: artwork.typology },
    { label: "Status", value: artwork.status === "retired" ? "Retired" : "Available to rent" },
  ].filter((m) => m.value);

  // Filters out empty array slots (added in Studio but never uploaded to) —
  // those have no asset ref and would crash urlFor() downstream.
  const galleryImages = (artwork.gallery ?? []).filter((img) => img.asset?._ref);
  const galleryRows = buildGalleryRows(galleryImages);
  const hasCrewMaterialsPress =
    (artwork.crew && artwork.crew.length > 0) ||
    (artwork.materials && artwork.materials.length > 0) ||
    (artwork.press && artwork.press.length > 0);

  return (
    <main>
      {/* Hero — aspect-ratio driven so the crop stays close to the source
          image's own proportions instead of an arbitrary viewport fraction;
          max-h keeps hero + card confined to the fold on short viewports. */}
      <section className="relative -mt-28 aspect-video max-h-[85svh] min-h-105 w-full overflow-hidden">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={artwork.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* Title card — sits on the image itself, anchored near the hero's
            bottom edge, house "hero project card" style */}
        <div className="absolute inset-x-0 bottom-8 mx-auto w-full max-w-screen-2xl px-gutter">
          <div className="w-fit max-w-[85%] bg-white px-8 py-6 shadow-[inset_0_0_0_2px_var(--fg),8px_8px_0_var(--fg)]">
            <Heading as="h1" level="h2" className="project-title leading-tight text-fg">
              {artwork.title}
            </Heading>
            {subtitle && (
              <p className="mt-1 font-body text-xl uppercase text-gray-label">{subtitle}</p>
            )}
          </div>
        </div>
      </section>

      {/* Metadata row, booking link, quote + body */}
      <div className="mx-auto w-full max-w-screen-xl px-gutter pt-24 pb-16">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8">
          {/* Metadata — cols 1-2, with a vertical rule marking the column */}
          {metadata.length > 0 && (
            <div className="col-span-12 flex flex-col gap-6 border-l border-fg/20 pl-4 md:col-span-2">
              {metadata.map((m) => (
                <div key={m.label}>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-fg">
                    {m.label}
                  </p>
                  <p className="mt-1 font-body text-base text-fg/70">{m.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Text — offset to cols 4-11 (8 of 12), leaving a column of
              space on each side; capped at 700px on large desktops */}
          {(artwork.quote || artwork.description) && (
            <div className="col-span-12 flex max-w-175 flex-col gap-6 md:col-span-8 md:col-start-4">
              {artwork.quote && (
                <p className="font-body text-xl italic leading-relaxed text-fg">{artwork.quote}</p>
              )}
              {artwork.description && (
                <div className="whitespace-pre-line font-body text-base leading-relaxed text-fg/80">
                  {artwork.description}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Optional content-break sections */}
      {artwork.sections?.map((section, i) => (
        <div key={i} className="mx-auto w-full max-w-screen-2xl px-gutter pb-16">
          <div className="group relative aspect-16/9 w-full overflow-hidden rounded-[2px]">
            <Image
              src={urlFor(section.image).url()}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <Heading level="h3" className="uppercase text-fg">{section.title}</Heading>
            <div className="font-body text-base leading-relaxed text-fg/80">
              <PortableText value={section.body} components={sectionBodyComponents} />
            </div>
          </div>
        </div>
      ))}

      {/* Gallery — large rows go full width, small rows group into a 3-up grid */}
      {galleryRows.length > 0 && (
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-1 px-gutter pb-16">
          {galleryRows.map((row, i) => {
            const gridCols =
              row.items.length === 3 ? "grid-cols-3" : row.items.length === 2 ? "grid-cols-2" : "grid-cols-1";
            const smallSizes =
              row.items.length === 3
                ? "(max-width: 768px) 100vw, 33vw"
                : row.items.length === 2
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "100vw";
            return (
              <div key={i} className={row.size === "large" ? "" : `grid gap-1 ${gridCols}`}>
                {row.items.map((img, j) => (
                  <div
                    key={j}
                    className={`group relative overflow-hidden rounded-[2px] ${
                      row.size === "large" ? "aspect-16/9 w-full" : "aspect-4/5"
                    }`}
                  >
                    <Image
                      src={urlFor(img).url()}
                      alt=""
                      fill
                      sizes={row.size === "large" ? "100vw" : smallSizes}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Booking + Crew / Materials / Press — rule separates this footer
          metadata from the gallery/sections above */}
      {(canBook || hasCrewMaterialsPress) && (
        <div className="mx-auto w-full max-w-screen-2xl px-gutter pb-24">
          <hr className="mb-8 border-t border-fg/20" />

          {canBook && (
            <Link
              href={contactHref}
              className="mb-8 inline-block font-body text-base text-fg underline underline-offset-2 transition-colors hover:text-fg/70"
            >
              Inquire about booking this piece
            </Link>
          )}

          {hasCrewMaterialsPress && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {artwork.crew && artwork.crew.length > 0 && (
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-fg">
                    Crew
                  </p>
                  <p className="mt-2 font-body text-base text-fg/70">{artwork.crew.join(", ")}</p>
                </div>
              )}
              {artwork.materials && artwork.materials.length > 0 && (
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-fg">
                    Materials
                  </p>
                  <p className="mt-2 font-body text-base text-fg/70">
                    {artwork.materials.join(", ")}
                  </p>
                </div>
              )}
              {artwork.press && artwork.press.length > 0 && (
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-fg">
                    Press
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    {artwork.press.map((p, i) =>
                      p.url ? (
                        <a
                          key={i}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-base text-fg/70 underline underline-offset-2 transition-colors hover:text-fg"
                        >
                          {p.text}
                        </a>
                      ) : (
                        <span key={i} className="font-body text-base text-fg/70">
                          {p.text}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <RelatedWorks artworks={related} />
    </main>
  );
}
