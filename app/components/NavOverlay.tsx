"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mail, X } from "lucide-react";

// Mirrors the footer's IA (Footer.tsx) — confirmed with the client as the
// current, correct site structure. Keep these two in sync.
const navLinks = [
  { label: "Projects", href: "/projects", tier: "primary" },
  { label: "Commission", href: "/commission", tier: "primary" },
  { label: "Where we work", href: "/map", tier: "secondary" },
  { label: "About", href: "/about", tier: "secondary" },
  { label: "Donate", href: "/donate", tier: "secondary" },
] as const;

type Props = {
  open: boolean;
  /** Closes the overlay; caller restores focus to the menu button. */
  onClose: () => void;
};

export default function NavOverlay({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Portal to document.body once mounted (SSR has no document) — guarantees
  // the backdrop/panel are the last nodes in the DOM, so they can never be
  // out-ranked by a `relative`/`transform`/`fixed` element added anywhere
  // else on the page, regardless of z-index.
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);

  // Initial focus, Esc to close, Tab trapped within the overlay
  useLayoutEffect(() => {
    if (!open) return;

    // Focus the panel itself rather than the close button so opening the
    // overlay doesn't paint a focus ring on the X icon. Tab from here lands
    // on the close button as normal, with a real (visible) focus ring.
    //
    // Must run in useLayoutEffect, not useEffect: the panel is always in the
    // DOM (visibility toggles via class), and a passive effect fires on a
    // delay after paint, racing the browser's own default click-to-focus on
    // the trigger button. If that native focus resolves after our call, or
    // if this fires before the visibility transition's style has committed,
    // the focus() call silently no-ops and focus is left on (or reverts to)
    // a `focus-visible:outline-pink` element — sometimes the close button —
    // painting the ring the instant the overlay opens. useLayoutEffect runs
    // synchronously right after DOM mutations, before paint, so it always
    // wins.
    overlayRef.current?.focus();

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

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-overlay-backdrop bg-black/40 transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Panel */}
      <div
        ref={overlayRef}
        tabIndex={-1}
        id="nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-overlay-panel w-full max-w-sm sm:max-w-md bg-bg flex flex-col overflow-y-auto overflow-x-hidden outline-none transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
          open
            ? "translate-x-0 visible pointer-events-auto"
            : "translate-x-full invisible pointer-events-none"
        }`}
      >
        {/* Benday-dot accent wedge */}
        <div
          aria-hidden="true"
          className="absolute left-0 bottom-0 pointer-events-none"
          style={{
            width: 190,
            height: 120,
            clipPath: "polygon(0 100%, 0 22%, 58% 58%, 100% 100%)",
            backgroundImage:
              "radial-gradient(circle, #191919 1.6px, transparent 2px), radial-gradient(circle, #191919 1.6px, transparent 2px)",
            backgroundSize: "9px 9px, 9px 9px",
            backgroundPosition: "0 0, 4.5px 4.5px",
          }}
        />

        {/* Close button */}
        <div className="px-gutter pt-5 pb-10 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center justify-center p-1 text-fg transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink cursor-pointer"
          >
            <X size={52} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-gutter pb-10 flex-1 flex flex-col items-end text-right gap-10 justify-center">
          {/* Nav links — equal size/weight; color carries the tier */}
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-3 items-end">
              {navLinks.map(({ label, href, tier }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`group relative inline-block text-3xl sm:text-4xl font-heading font-normal leading-[0.95] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink ${
                      tier === "primary"
                        ? "text-fg"
                        : "text-gray-label transition-colors duration-200 hover:text-fg focus-visible:text-fg"
                    }`}
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 right-0 h-[3px] w-0 bg-fg transition-all duration-200 ease-out group-hover:w-full"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact — isolated, lower hierarchy than every link above */}
          <div className="mt-auto flex flex-col items-end gap-3">
            <Link
              href="/contact"
              onClick={onClose}
              className="group relative inline-block text-base sm:text-lg font-body font-normal text-gray-label/80 transition-colors duration-200 hover:text-gray-label focus-visible:text-gray-label focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            >
              Contact us
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 right-0 h-px w-0 bg-gray-label transition-all duration-200 ease-out group-hover:w-full"
              />
            </Link>
            <a
              href="mailto:info@lookingup.art"
              className="inline-flex items-center gap-1.5 text-sm font-body text-gray-label/80 transition-colors duration-200 hover:text-gray-label focus-visible:text-gray-label focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            >
              <Mail size={14} strokeWidth={1.75} aria-hidden="true" />
              info@lookingup.art
            </a>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
