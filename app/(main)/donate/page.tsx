import type { Metadata } from "next";
import Link from "next/link";
import { activeCampaign } from "@/config/campaign";
import {
  DonationForm,
  CancelledNotice,
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
            Art belongs to everyone
          </h1>
          <p className="font-body text-fg/70 text-lg leading-relaxed">
            Looking Up Art is a collective of artists and builders who channel 100% of donations back into art. That only works because people like you
            choose to be part of the community.
          </p>
        </header>

        {showCancelled && (
          <div className="mb-8">
            <CancelledNotice />
          </div>
        )}

        {/* Two-col: donation form (left) + FAQ (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Left — donation form card */}
          <div className="bg-footer-bg border border-fg/10 border-t-4 border-t-pink rounded-xl p-8 md:p-10">
            <DonationForm />
          </div>

          {/* Right — FAQ */}
          <div className="pt-1">
            <h2 className="font-sans text-xl font-bold mb-3">
              Common questions
            </h2>
            <div className="w-8 h-0.5 bg-pink mb-5" aria-hidden="true" />
            <p className="font-body text-fg/50 text-sm mb-6 leading-relaxed">
              Crypto, stock, donor-advised funds, checks, and employer
              matching — we can work with any of it.
            </p>
            <FaqAccordion />
          </div>
        </div>

        {/* Trust strip */}
        <TrustStrip />

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
