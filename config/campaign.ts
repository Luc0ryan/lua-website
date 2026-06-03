export interface CampaignConfig {
  enabled: boolean;
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  /** ISO date string — banner auto-hides after this date. Optional. */
  endsAt?: string;
}

export const activeCampaign: CampaignConfig = {
  enabled: false, // set to true to show the campaign banner
  title: "Burning Man 2025 Installation",
  description:
    "Help us build this year's large-scale sculpture at Black Rock City. Every dollar goes directly to materials, fabrication, and the artists who make it real.",
  ctaLabel: "Back the Project on Kickstarter",
  ctaUrl: "https://kickstarter.com/", // TODO: replace with live Kickstarter URL
  endsAt: "2025-08-01",
};
