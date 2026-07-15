import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getArtworkBySlug, type Artwork } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

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

  const [firstImage, ...restImages] = artwork.gallery ?? [];
  const hasCrewMaterialsPress =
    (artwork.crew && artwork.crew.length > 0) ||
    (artwork.materials && artwork.materials.length > 0) ||
    (artwork.press && artwork.press.length > 0);

  return (
    <main>
      {/* Hero */}
      <section className="relative -mt-2 h-[70svh] min-h-[420px] w-full overflow-hidden">
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
        {/* Top scrim — keeps nav chrome readable over the image */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 16%)",
          }}
        />
      </section>

      {/* Title card — straddles the hero/content seam, house "hero project card" style */}
      <div className="relative mx-auto w-full max-w-screen-2xl px-gutter">
        <div className="absolute -top-14 left-gutter max-w-[85%] bg-white px-8 py-6 shadow-[inset_0_0_0_2px_var(--fg),8px_8px_0_var(--fg)]">
          <h1 className="font-heading text-4xl font-bold project-title leading-tight text-fg">
            {artwork.title}
          </h1>
          {subtitle && (
            <p className="mt-1 font-body text-xl uppercase text-gray-label">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Metadata row, booking link, quote + body */}
      <div className="mx-auto w-full max-w-screen-2xl px-gutter pt-24 pb-16">
        {metadata.length > 0 && (
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {metadata.map((m) => (
              <div key={m.label}>
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-fg">
                  {m.label}
                </p>
                <p className="font-body text-base text-fg/70">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        {canBook && (
          <Link
            href={contactHref}
            className="mt-4 inline-block font-body text-base text-fg underline underline-offset-2 transition-colors hover:text-fg/70"
          >
            Inquire about booking this piece
          </Link>
        )}

        {(metadata.length > 0 || canBook) && <hr className="mt-8 border-t border-fg/20" />}

        {(artwork.quote || artwork.description) && (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {artwork.quote && (
              <p className="font-body text-xl italic leading-relaxed text-fg">
                &ldquo;{artwork.quote}&rdquo;
              </p>
            )}
            {artwork.description && (
              <div className="whitespace-pre-line font-body text-base leading-relaxed text-fg/80">
                {artwork.description}
              </div>
            )}
          </div>
        )}
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
            <h2 className="font-heading text-2xl font-bold uppercase text-fg">{section.title}</h2>
            <div className="font-body text-base leading-relaxed text-fg/80">
              <PortableText value={section.body} components={sectionBodyComponents} />
            </div>
          </div>
        </div>
      ))}

      {/* Image sequence */}
      {firstImage && (
        <div className="mx-auto w-full max-w-screen-2xl px-gutter pb-4">
          <div className="group relative aspect-16/9 w-full overflow-hidden rounded-[2px]">
            <Image
              src={urlFor(firstImage).url()}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>
      )}
      {restImages.length > 0 && (
        <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-4 px-gutter pb-16 md:grid-cols-2">
          {restImages.map((img, i) => (
            <div key={i} className="group relative aspect-4/5 overflow-hidden rounded-[2px]">
              <Image
                src={urlFor(img).url()}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      )}

      {/* Crew / Materials / Press */}
      {hasCrewMaterialsPress && (
        <div className="mx-auto w-full max-w-screen-2xl px-gutter pb-24">
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
        </div>
      )}
    </main>
  );
}
