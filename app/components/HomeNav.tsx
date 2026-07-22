"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import NavOverlay from "./NavOverlay";

function isHeroRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/commission" ||
    /^\/projects\/[^/]+$/.test(pathname)
  );
}


export default function HomeNav() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const overlay = isHeroRoute(pathname);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Small buffer so rubber-banding at the very top doesn't flicker it.
      if (y <= 8) {
        setHidden(false);
      } else if (y > lastY) {
        setHidden(true);
      } else if (y < lastY) {
        setHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        className={`${overlay ? "fixed" : "sticky"} top-0 z-50 w-full pt-6 pb-4 transition-transform duration-300 ${
          overlay
            ? "bg-transparent"
            : "bg-bg border-b border-black/10"
        } ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="relative max-w-screen-2xl mx-auto px-6 flex items-start justify-between">
          <Link href="/" className="relative flex h-16 aspect-[120/48] shrink-0">
            <Image
              src={overlay ? "/logos/logo-opaque-1000.png" : "/logos/logo-black-1000.png"}
              alt="Looking Up Arts"
              fill
              sizes="160px"
              className="object-contain object-left"
              priority
            />
          </Link>

          <div className="flex items-center gap-5">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="nav-overlay"
              aria-label="Open menu"
              className="group flex cursor-pointer items-center justify-center p-1 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
            >
              {overlay ? (
                <Menu
                  size={32}
                  strokeWidth={2}
                  className="text-white transition-all duration-150 [filter:drop-shadow(1px_1px_0_rgba(0,0,0,0.55))_drop-shadow(-1px_-1px_0_rgba(0,0,0,0.55))_drop-shadow(1px_-1px_0_rgba(0,0,0,0.55))_drop-shadow(-1px_1px_0_rgba(0,0,0,0.55))] group-hover:[filter:drop-shadow(1px_1px_0_rgba(0,0,0,0.8))_drop-shadow(-1px_-1px_0_rgba(0,0,0,0.8))_drop-shadow(1px_-1px_0_rgba(0,0,0,0.8))_drop-shadow(-1px_1px_0_rgba(0,0,0,0.8))]"
                />
              ) : (
                <Menu size={26} strokeWidth={1.5} className="transition-all duration-150 group-hover:drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)]" />
              )}
            </button>

            <Link
              href="/contact"
              className="hidden md:inline-block border border-fg bg-bg text-base font-body font-semibold tracking-wide px-4 py-2.5 text-fg shadow-[4px_4px_0_var(--fg)] transition-all duration-150 hover:shadow-[4px_4px_0_var(--lua-pink)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:[transition:none]"
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
