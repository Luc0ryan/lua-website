"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { label: "ARTWORKS", href: "/artworks" },
  { label: "COMMUNITY", href: "/community" },
  { label: "SERVICES", href: "/services" },
  { label: "CONTACT", href: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-gutter py-5 transition-all duration-300 ${
        scrolled ? "bg-[#F2EFEA]/60 backdrop-blur-sm border-b border-black/10" : "bg-transparent"
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
              className="text-base font-body font-medium tracking-wide text-fg relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-fg transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
