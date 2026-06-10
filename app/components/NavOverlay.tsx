"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";

const primaryLinks = [
  { label: "PROJECTS", href: "/artworks" },
  { label: "CATALOGUE", href: "/catalogue" }, // TODO page: route not built yet
  { label: "WORK WITH US", href: "/work-with-us" }, // TODO page: route not built yet
  { label: "ABOUT", href: "/about" },
];

const secondaryLinks = [
  { label: "Community", href: "/community" },
  { label: "Donate", href: "/donate" },
  { label: "Reach", href: "#" }, // TODO route
  { label: "Store", href: "#" }, // TODO route
];

type Props = {
  open: boolean;
  /** Closes the overlay; caller restores focus to the menu button. */
  onClose: () => void;
};

export default function NavOverlay({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Initial focus, Esc to close, Tab trapped within the overlay
  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;

      const focusables = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])"
        )
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      id="nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={`fixed inset-0 z-[60] bg-bg flex flex-col overflow-y-auto transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
        open
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-3 invisible"
      }`}
    >
      {/* Top bar mirrors the nav so the close button lands where the menu button was */}
      <div className="w-full max-w-screen-2xl mx-auto px-gutter py-5 flex items-center justify-end shrink-0">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex items-center justify-center p-1 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
        >
          <X size={26} strokeWidth={1.5} />
        </button>
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-gutter pb-10 flex-1 grid md:grid-cols-2 gap-x-10 gap-y-12 content-start md:content-center">
        {/* Left column: primary tier */}
        <nav aria-label="Primary">
          <ul className="flex flex-col gap-3 md:gap-4">
            {primaryLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="inline-block text-5xl sm:text-6xl md:text-7xl font-heading font-bold uppercase leading-[0.95] text-fg transition-colors duration-200 hover:text-pink focus-visible:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right column: secondary tier + contact */}
        <div className="flex flex-col md:items-end md:text-right">
          <nav aria-label="Secondary">
            <ul className="flex flex-col gap-2.5 md:items-end">
              {secondaryLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="inline-block text-lg md:text-xl font-body font-medium text-gray-label transition-colors duration-200 hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-10 flex flex-col items-start md:items-end gap-3">
            <Link
              href="/contact"
              onClick={onClose}
              className="group inline-flex items-center gap-1.5 text-lg md:text-xl font-body font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            >
              Contact us
              <ArrowRight
                size={20}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
            <a
              href="mailto:info@lookingup.art"
              className="inline-block text-base font-body text-gray-label transition-colors duration-200 hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            >
              info@lookingup.art
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
