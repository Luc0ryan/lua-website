"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const primaryNav = [
  { label: "Projects", href: "/projects" },
  { label: "Community", href: "/community" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const secondaryNav = [
  { label: "Donate", href: "/donate" },
  { label: "Map", href: "/map" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-footer-bg relative overflow-hidden mt-auto">
      <div className="relative w-full max-w-6xl mx-auto px-gutter pt-12 pb-8">
        <div className="flex flex-col gap-10 mb-12 md:flex-row md:items-start md:justify-between">
          {/* Nav lists */}
          <div className="flex gap-16">
            <ul className="space-y-2">
              {primaryNav.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm font-heading font-semibold tracking-widest uppercase text-fg hover:text-pink transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {secondaryNav.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm font-heading font-medium tracking-widest uppercase text-fg/75 hover:text-fg transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-xs w-full">
            <p className="text-sm font-sans font-medium text-fg/70 mb-3">
              New projects, events, and stories — straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center border-b border-fg/30 focus-within:border-fg transition-colors"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm font-sans text-fg placeholder:text-fg/30 py-2 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="pl-2 py-2 text-fg/40 hover:text-fg transition-colors"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          </div>

          {/* Contact Us — pop art card (commented out) */}
          {/* <Link
            href="/contact"
            className="shrink-0 border-2 border-[#2B2B2B] bg-bg px-7 py-6 shadow-[3px_3px_0px_#2B2B2B] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#2B2B2B] md:min-w-55"
          >
            <p className="font-sans font-bold text-[30px] leading-tight text-[#2B2B2B] uppercase mb-3">
              CONTACT US
            </p>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[15px] text-[#2B2B2B]/70">
                Interested in collaborating?
              </span>
              <span className="text-lg text-[#2B2B2B]">›</span>
            </div>
          </Link> */}
        </div>

        {/* Copyright */}
        <div className="pt-6">
          <p className="text-xs font-sans text-fg/40 uppercase tracking-widest">
            © 2026 LOOKING UP ARTS
          </p>
        </div>
      </div>
    </footer>
  );
}
