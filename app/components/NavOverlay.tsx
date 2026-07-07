"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Mail, X } from "lucide-react";

const primaryLinks = [
  { label: "PROJECTS", href: "/projects" },
  { label: "CATALOGUE", href: "/catalogue" },
  { label: "COMMISSION", href: "/commission" },
];

const secondaryLinks = [
  { label: "Donate", href: "/donate" },
  { label: "Reach", href: "#" },
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
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[59] bg-black/40 transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Panel */}
      <div
        ref={overlayRef}
        id="nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-sm sm:max-w-md bg-bg flex flex-col overflow-y-auto transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
          open
            ? "translate-x-0 visible pointer-events-auto"
            : "translate-x-full invisible pointer-events-none"
        }`}
      >
        {/* Close button */}
        <div className="px-gutter pt-5 pb-10 flex items-center justify-end shrink-0">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center justify-center p-1 text-fg transition-colors duration-200 hover:text-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink cursor-pointer"
          >
            <X size={52} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-gutter pb-10 flex-1 flex flex-col items-end text-right gap-10 justify-center">
          {/* Primary links */}
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-2 items-end">
              {primaryLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="inline-block text-4xl sm:text-5xl font-heading font-bold uppercase leading-[0.95] text-fg transition-colors duration-200 hover:text-pink focus-visible:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Secondary links */}
          <nav aria-label="Secondary">
            <ul className="flex flex-col gap-2 items-end">
              {secondaryLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="inline-block text-2xl sm:text-3xl font-body font-medium text-gray-label transition-colors duration-200 hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="mt-auto flex flex-col items-end gap-3">
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-block text-lg font-body font-semibold text-fg transition-colors duration-200 hover:text-pink focus-visible:text-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            >
              Contact us
            </Link>
            <a
              href="mailto:info@lookingup.art"
              className="inline-flex items-center gap-1.5 text-base font-body text-gray-label transition-colors duration-200 hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            >
              <Mail size={15} strokeWidth={1.75} aria-hidden="true" />
              info@lookingup.art
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
