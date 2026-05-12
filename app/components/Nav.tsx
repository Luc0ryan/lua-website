"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { label: "ARTWORKS", href: "/artworks" },
  { label: "COMMUNITY", href: "/community" },
  { label: "SERVICES", href: "/services" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 flex items-center justify-between px-gutter py-5 transition-all duration-300 w-full ${
        scrolled ? "bg-bg/60 backdrop-blur-sm border-b border-black/10" : "bg-transparent"
      }`}
    >
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

      <ul className="flex items-center gap-8">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className={`text-base font-body font-medium tracking-wide relative group py-1 px-0.5 transition-colors duration-200 ${
                pathname === href ? "text-magenta" : "text-fg"
              }`}
            >
              {label}
              <span
                className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                  pathname === href
                    ? "w-full bg-magenta"
                    : "w-0 bg-fg group-hover:w-full"
                }`}
              />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className={`text-sm font-body font-medium tracking-wide px-4 py-2 border transition-all duration-150 ${
          pathname === "/contact"
            ? "bg-fg text-bg border-fg shadow-none translate-x-[3px] translate-y-[3px]"
            : "bg-transparent text-fg border-fg shadow-[3px_3px_0px_#111111] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
        }`}
      >
        CONTACT
      </Link>
    </nav>
  );
}
