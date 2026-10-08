"use client";

import { Heading } from "@/app/components/ui/Heading";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-screen-2xl px-gutter py-32">
        <Heading as="h1" level="display" weight="medium" className="text-fg">
          SOMETHING WENT WRONG
        </Heading>
        <p className="mt-4 max-w-prose font-sans text-lg text-fg">
          We couldn&apos;t load this page. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 border-2 border-fg bg-fg px-5 py-3 font-sans text-lg text-bg transition-colors hover:border-lua-pink hover:bg-lua-pink"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
