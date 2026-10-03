import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { activeCampaign } from "@/config/campaign";
import { getDonorFundedArtworks } from "@/sanity/lib/queries";
import { ArtworkCard } from "@/app/components/ArtworkCard";
import { FaqList } from "@/app/components/ui/FaqList";
import { Heading } from "@/app/components/ui/Heading";
import { DonationForm } from "./DonateClient";
import { DONATE_FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "Donate — Looking Up Art",
  description:
    "Support Looking Up Art. Your gift funds artists and large-scale community art installations.",
};

interface DonatePageProps {
  searchParams: Promise<{ cancelled?: string }>;
}

function isCampaignActive(): boolean {
  if (!activeCampaign.enabled) return false;
  if (activeCampaign.endsAt && new Date() > new Date(activeCampaign.endsAt)) {
    return false;
  }
  return true;
}

function CampaignCallout() {
  const campaign = activeCampaign;
  const endsAt = campaign.endsAt ? new Date(campaign.endsAt) : null;

  return (
    <section className="mt-16 flex flex-col items-start gap-6 border-2 border-fg bg-pink-fill p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex flex-col gap-2">
        {endsAt && (
          <p className="font-sans text-sm text-text-muted">
            Ends{" "}
            {endsAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
        <Heading level="h3" className="text-fg">
          {campaign.title}
        </Heading>
        <p className="max-w-prose font-sans text-base text-fg">{campaign.description}</p>
      </div>
      <a
        href={campaign.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 border-2 border-fg bg-white px-5 py-3 font-sans text-lg text-fg transition-colors hover:bg-fg hover:text-bg"
      >
        {campaign.ctaLabel}
      </a>
    </section>
  );
}

function PhotoCaption({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/projects/sirsasana"
      className={`group inline-flex flex-col border-2 border-fg bg-white px-3 py-2 ${className}`}
    >
      <span className="font-sans text-xs text-text-muted">Pictured · Black Rock City</span>
      <span className="font-sans text-sm font-semibold text-fg project-title group-hover:text-lua-pink transition-colors">
        Sirsasana
      </span>
    </Link>
  );
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const [params, artworks] = await Promise.all([searchParams, getDonorFundedArtworks()]);
  const showCancelled = params.cancelled === "1";

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero: the photo frames the form. Below lg the photo is a band the
          panel overlaps; from lg up it's a full-bleed backdrop and the panel
          sits in the left half, clear of the sculpture. */}
      <section className="relative -mt-28">
        <div className="relative h-[60svh] min-h-[380px] w-full lg:absolute lg:inset-0 lg:h-auto">
          <Image
            src="/images/donate/hero.jpg"
            alt="Sirsasana, a tall wooden lattice sculpture with teal fabric canopies, on the playa at Black Rock City as a dust devil passes"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-[62%_center]"
          />
          <PhotoCaption className="absolute bottom-6 right-gutter hidden lg:inline-flex" />
        </div>

        <div className="relative mx-auto w-full max-w-screen-2xl px-gutter lg:grid lg:min-h-svh lg:grid-cols-2 lg:items-center lg:pt-28 lg:pb-16">
          <div className="relative z-10 -mt-36 mx-auto w-full max-w-[460px] border-2 border-fg bg-white p-6 md:p-8 lg:mt-0">
            {showCancelled && (
              <p role="alert" className="mb-6 border-2 border-fg bg-pink-fill px-4 py-3 font-sans text-sm text-fg">
                Checkout was cancelled and no charge was made. Try again whenever you&apos;re ready.
              </p>
            )}
            <Heading as="h1" level="display" weight="medium" className="text-fg">
              DONATE
            </Heading>
            <p className="mt-3 mb-6 font-sans text-base text-fg">
              Every dollar goes to artists, materials, and getting ambitious work built.
            </p>
            <DonationForm />
          </div>
          <div className="mt-6 flex justify-center lg:hidden">
            <PhotoCaption />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-screen-2xl px-gutter">
        {isCampaignActive() && <CampaignCallout />}

        {artworks.length > 0 && (
          <section className="pt-20 md:pt-24">
            <div className="mb-8 flex flex-col gap-2">
              <Heading level="h2" className="text-fg uppercase tracking-tight">
                What your gift builds
              </Heading>
              <p className="max-w-prose font-sans text-lg text-fg">
                Looking Up grants fund large, interactive festival installations like these.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} featured={false} />
              ))}
            </div>
          </section>
        )}

        <FaqList items={DONATE_FAQS} />
      </div>
    </div>
  );
}
