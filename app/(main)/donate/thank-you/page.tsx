import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You — Looking Up Art",
  description: "Your donation has been received. Thank you for supporting Looking Up Art.",
};

export default function ThankYouPage() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-gutter py-40 text-center">
      <p className="text-xs font-sans font-semibold tracking-widest uppercase text-fg/50 mb-4">
        Gift confirmed
      </p>
      <h1 className="font-sans text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-2xl">
        Thank you for your support.
      </h1>
      <p className="font-body text-fg/70 text-lg leading-relaxed max-w-xl mb-10">
        Your gift directly supports artists and large-scale community art. A
        receipt has been sent to your email.
      </p>
      <Link
        href="/"
        className="inline-block bg-fg text-bg font-sans font-semibold tracking-widest uppercase px-8 py-4 rounded transition-opacity hover:opacity-80"
      >
        Back to Home
      </Link>
    </section>
  );
}
