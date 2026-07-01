"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import NavOverlay from "./NavOverlay";

function isHeroRoute(pathname: string): boolean {
  return pathname === "/";
}


export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const overlay = isHeroRoute(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    menuButtonRef.current?.focus();
  };

  // Over a hero image (transparent + unscrolled) the chrome must survive any
  // background; once scrolled onto the solid nav it matches the rest of the site.
  const onImage = overlay && !scrolled;

  return (
    <>
      <nav
        className={`${overlay ? "fixed" : "sticky"} top-0 z-50 w-full pt-10 pb-5 transition-all duration-300 ${
          scrolled
            ? "bg-bg border-b border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-gutter flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src={
                onImage
                  ? "/logos/logo-opaque-1000.png"
                  : "/logos/logo-black-1000.png"
              }
              alt="Looking Up Arts"
              width={120}
              height={48}
              className={`${onImage ? "h-16" : "h-14"} w-auto`}
              preload
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
              {onImage ? (
                <Menu size={32} strokeWidth={2} className="text-white transition-all duration-150 group-hover:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]" />
              ) : (
                <Menu size={26} strokeWidth={1.5} className="transition-all duration-150 group-hover:drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)]" />
              )}
            </button>

            <Link
              href="/contact"
              className="hidden md:inline-block border border-fg bg-bg text-base font-body font-semibold tracking-wide px-4 py-2.5 text-fg shadow-[4px_4px_0_var(--fg)] transition-all duration-150 hover:shadow-[4px_4px_0_#DC738F] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:[transition:none]"
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
