"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import NavOverlay from "./NavOverlay";

// Photo hero routes: a full-bleed image/video sits under the nav, so chrome
// goes light (white logo/icons) with a scrim. Deliberately route-based, not
// scroll-based, so it can never flicker.
function isHeroRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/commission" ||
    pathname === "/about" ||
    pathname.startsWith("/donate") ||
    /^\/projects\/[^/]+$/.test(pathname)
  );
}

// The map is a full-viewport app-style page: sidebar on the left, map on the
// right, and the nav floats over both.
function isMapRoute(pathname: string): boolean {
  return pathname === "/map" || pathname.startsWith("/map/");
}

// Nav floats transparent over these routes instead of sitting on a solid bar.
// The map floats over a light basemap, so it keeps dark chrome and no scrim.
function isFloatingRoute(pathname: string): boolean {
  return isHeroRoute(pathname) || isMapRoute(pathname);
}

export default function HomeNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const overlay = isFloatingRoute(pathname);
  const lightChrome = isHeroRoute(pathname);
  // On the map the nav spans the full viewport edge to edge (logo over the
  // sidebar) and only its own controls take clicks, so it never blocks
  // dragging the map beneath it.
  const mapRoute = isMapRoute(pathname);

  // Prevent body scroll while the overlay is open.
  // Compensate for the scrollbar width so the content doesn't shift right when
  // the scrollbar disappears.
  useEffect(() => {
    if (menuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);

    // Return focus to the trigger for a11y, but suppress the focus ring for
    // this programmatic call — it reappears normally on a later real Tab-focus.
    const btn = menuButtonRef.current;
    if (btn) {
      btn.style.outline = "none";
      btn.addEventListener(
        "blur",
        () => {
          btn.style.outline = "";
        },
        { once: true }
      );
      btn.focus();
    }
  };

  return (
    <>
      <nav
        className={`absolute top-0 z-nav w-full pt-6 pb-4 ${
          overlay ? "bg-transparent" : "bg-bg border-b border-black/10"
        } ${mapRoute ? "pointer-events-none" : ""}`}
      >
        {/* Scrim — keeps the white logo/icons legible over any hero image,
            without needing a hard-edged solid bar. Overlay mode only. */}
        {lightChrome && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent"
          />
        )}

        <div
          className={`relative w-full px-gutter flex items-start justify-between ${
            mapRoute ? "" : "max-w-screen-2xl mx-auto"
          }`}
        >
          <Link href="/" className="pointer-events-auto flex h-16 shrink-0 cursor-pointer">
            <Image
              src={lightChrome ? "/logos/logo-opaque-1000.png" : "/logos/logo-black-1000.png"}
              alt="Looking Up Arts"
              width={1000}
              height={863}
              sizes="160px"
              className="h-full w-auto object-contain"
              priority
            />
          </Link>

          <div className="pointer-events-auto flex items-center gap-5">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="nav-overlay"
              aria-label="Open menu"
              className="group flex cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
            >
              {/* Mobile: white circle, black stroke, black icon — legible over any hero image */}
              <span className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-fg">
                <Menu size={20} strokeWidth={2} className="text-fg" />
              </span>

              {/* Desktop */}
              <span className="hidden md:flex items-center justify-center p-1">
                {lightChrome ? (
                  <Menu size={40} strokeWidth={2.5} className="text-white transition-opacity duration-150 group-hover:opacity-60" />
                ) : (
                  <Menu size={34} strokeWidth={2} className="text-fg transition-opacity duration-150 group-hover:opacity-60" />
                )}
              </span>
            </button>

            <Link
              href="/contact"
              className="hidden md:inline-block border border-fg bg-bg text-base font-body font-semibold tracking-wide px-4 py-2.5 text-fg shadow-[4px_4px_0_var(--fg)] transition-all duration-150 hover:shadow-[2px_2px_0_var(--fg)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:[transition:none]"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </nav>

      <NavOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
