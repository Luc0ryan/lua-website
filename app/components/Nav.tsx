"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { label: "PROJECTS", href: "/artworks" },
  { label: "COMMUNITY", href: "/community" },
  { label: "SERVICES", href: "/services" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full py-5 transition-all duration-300 ${
          scrolled || menuOpen ? "bg-bg/60 backdrop-blur-sm border-b border-black/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-gutter flex items-center justify-between">
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

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`text-base font-body font-medium tracking-wide relative group py-1 px-0.5 transition-colors duration-200 ${
                  pathname === href ? "text-pink" : "text-fg"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                    pathname === href
                      ? "w-full bg-pink"
                      : "w-0 bg-fg group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className={`hidden md:inline-block text-sm font-body font-medium tracking-wide px-4 py-2 border transition-all duration-150 ${
            pathname === "/contact"
              ? "bg-fg text-bg border-fg shadow-none translate-x-0.75 translate-y-0.75"
              : "bg-transparent text-fg border-fg shadow-[3px_3px_0px_#111111] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75"
          }`}
        >
          CONTACT
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-1 text-fg"
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
        </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-bg flex flex-col pt-24 px-gutter md:hidden">
          <ul className="flex flex-col gap-6">
            {links.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`text-2xl font-body font-medium tracking-wide transition-colors duration-200 ${
                    pathname === href ? "text-pink" : "text-fg"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/contact"
              className={`inline-block text-sm font-body font-medium tracking-wide px-4 py-2 border transition-all duration-150 ${
                pathname === "/contact"
                  ? "bg-fg text-bg border-fg shadow-none translate-x-0.75 translate-y-0.75"
                  : "bg-transparent text-fg border-fg shadow-[3px_3px_0px_#111111]"
              }`}
            >
              CONTACT
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
