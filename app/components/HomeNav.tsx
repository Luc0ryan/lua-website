"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import NavOverlay from "./NavOverlay";

export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll while the overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full py-5 transition-all duration-300 ${
          scrolled
            ? "bg-bg border-b border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-gutter flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src="/luaLogo.png"
              alt="Looking Up Arts"
              width={120}
              height={48}
              className="h-10 w-auto"
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
              className="flex items-center justify-center p-1 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
            >
              <Menu size={26} strokeWidth={1.5} />
            </button>

            <Link
              href="/contact"
              className="hidden md:inline-block text-sm font-body font-medium tracking-wide px-4 py-2 border transition-all duration-150 bg-transparent text-fg border-fg shadow-[3px_3px_0px_#111111] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </nav>

      <NavOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
