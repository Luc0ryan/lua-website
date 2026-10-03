"use client";

import { type ReactNode, useState } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import { Heading } from "@/app/components/ui/Heading";

export type FaqItem = { question: string; answer: ReactNode };

// Shared FAQ block — stacked heading on the left, heavy-ruled accordion on the
// right. Used by Commission and Donate so the two can't drift apart.
export function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="pt-16 pb-16">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <Heading level="h2" className="text-fg tracking-tight leading-tight shrink-0">
          Frequently
          <br />
          Asked
          <br />
          Questions
        </Heading>
        <div className="flex flex-1 flex-col">
          {items.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question} className="border-t-2 border-fg last:border-b-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-heading text-xl text-fg tracking-tight">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <CircleMinus className="shrink-0 text-fg" size={32} aria-hidden="true" />
                  ) : (
                    <CirclePlus className="shrink-0 text-fg" size={32} aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <div className="font-sans text-base text-fg pb-5 pr-10">{faq.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
