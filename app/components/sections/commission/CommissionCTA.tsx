import Link from "next/link";

export default function CommissionCTA() {
  return (
    <section className="flex flex-col items-start gap-6 pt-16 pb-16 md:flex-row md:items-center">
      <p className="font-heading font-normal tracking-tight leading-tight">
        <span className="block text-purple-commission text-[clamp(2rem,5vw,3.5rem)]">
          Start the conversation
        </span>
        <span className="block text-fg text-[clamp(1.5rem,3.6vw,2.75rem)]">
          Tell us about your site and budget
        </span>
      </p>
      <div className="md:flex md:flex-1 md:justify-center">
        <Link
          href="/contact"
          className="shrink-0 border-[3px] border-fg bg-bg text-fg font-sans text-2xl px-6 py-3 shadow-[6px_6px_0_var(--fg)] transition-all duration-150 hover:shadow-[6px_6px_0_var(--purple-commission)] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none active:[transition:none]"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
