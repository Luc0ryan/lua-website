import type { Metadata } from "next";
import Link from "next/link";
import { activeCampaign } from "@/config/campaign";
import {
  OneTimeDonation,
  CancelledNotice,
  RecurringDonation,
  TrustStrip,
  FaqAccordion,
} from "./DonateClient";

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

function CampaignBanner() {
  const campaign = activeCampaign;
  const endsAt = campaign.endsAt ? new Date(campaign.endsAt) : null;

  return (
    <div className="w-full bg-pink text-bg px-gutter py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-sans font-semibold tracking-widest uppercase opacity-80">
            Active campaign
            {endsAt && (
              <>
                {" "}
                &mdash; ends{" "}
                {endsAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </>
            )}
          </p>
          <p className="font-sans font-bold text-xl leading-tight">
            {campaign.title}
          </p>
          <p className="font-body text-sm opacity-90 leading-snug max-w-prose">
            {campaign.description}
          </p>
        </div>
        <a
          href={campaign.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-block bg-bg text-fg font-sans font-semibold tracking-widest uppercase text-sm px-6 py-3 rounded transition-opacity hover:opacity-80 whitespace-nowrap"
        >
          {campaign.ctaLabel}
        </a>
      </div>
    </div>
  );
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const params = await searchParams;
  const showCancelled = params.cancelled === "1";
  const campaignActive = isCampaignActive();

  return (
    <div className="flex-1 flex flex-col">
      {campaignActive && <CampaignBanner />}

      <main className="flex-1 px-gutter py-20 md:py-32 max-w-6xl mx-auto w-full">
        {/* Page header */}
        <header className="max-w-3xl mb-10">
          <h1 className="font-sans text-5xl md:text-6xl font-bold leading-tight mb-5">
            Art belongs to everyone.
          </h1>
          <p className="font-body text-fg/70 text-lg leading-relaxed">
            Looking Up Art makes monumental, community-driven public art that
            is free and open to all. That only works because people like you
            choose to be part of it.
          </p>
        </header>

        {showCancelled && (
          <div className="mb-8">
            <CancelledNotice />
          </div>
        )}

        {/* Donation options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OneTimeDonation />
          <RecurringDonation />
        </div>

        {/* Trust strip */}
        <TrustStrip />

        {/* Other ways to give */}
        <section aria-labelledby="other-ways-heading">
          <h2
            id="other-ways-heading"
            className="font-sans text-2xl md:text-3xl font-bold mb-2"
          >
            Other Ways to Give
          </h2>
          <p className="font-body text-fg/60 text-sm mb-8">
            Crypto, stock, donor-advised funds, checks, and employer
            matching — we can work with any of it.
          </p>
          <FaqAccordion />
        </section>

        {/* Fine print */}
        <p className="mt-16 font-body text-xs text-fg/40 text-center">
          Looking Up Art is a registered 501(c)(3) nonprofit. All donations are
          tax-deductible to the full extent allowed by law.{" "}
          {/* TODO: insert EIN */}
          EIN: [INSERT EIN].{" "}
          <Link
            href="/contact"
            className="underline underline-offset-2 hover:text-fg/70 transition-colors"
          >
            Questions? Contact us.
          </Link>
        </p>
      </main>
    </div>
  );
}
