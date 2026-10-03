import { FaqList, type FaqItem } from "@/app/components/ui/FaqList";

const faqs: FaqItem[] = [
  {
    question: "Do you work with cities and public agencies?",
    answer:
      "Yes — a large portion of our work is commissioned through public art programs, percent-for-art ordinances, and civic partnerships. We're experienced with RFP processes, community engagement requirements, and the specific approvals that come with publicly funded projects.",
  },
  {
    question: "Can your installations be rented or leased?",
    answer:
      "Absolutely. Many of our works are available for short-term activation, seasonal placement, or multi-year lease agreements. Rental terms are tailored to your site, timeline, and budget — whether you're a municipality, developer, festival, or private estate. Reach out to discuss what's available.",
  },
  {
    question: "How long does a commission typically take?",
    answer:
      "From initial concept to installation, most commissions run 6–18 months depending on scale, permitting complexity, and fabrication lead times. We'll give you a realistic timeline in the earliest stages so there are no surprises.",
  },
  {
    question: "What happens to a piece after an installation closes?",
    answer:
      "Temporary works are carefully deinstalled and — where possible — components are repurposed, donated, or relocated. Some pieces go into permanent collections. We plan for end-of-life from the start, so deinstallation is never an afterthought.",
  },
  {
    question: "Can we commission something site-specific?",
    answer:
      "Site-specific work is our specialty. We start with deep listening — the history of a place, its community, its light and scale — before a single sketch is made. The result is art that couldn't exist anywhere else.",
  },
  {
    question: "Is Rainbow Bridge still in the desert?",
    answer:
      "Sadly, no. Rainbow Bridge has moved on to greener pastures — or rather, wetter ones. Like all temporary public installations, it had a beautiful run before coming down. The good news? Art that doesn't last forever tends to be the most talked-about. Ask us about what's currently up.",
  },
];

export default function CommissionFAQ() {
  return <FaqList items={faqs} />;
}
