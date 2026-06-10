"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import HomeNav from "./HomeNav";

// Homepage gets the collapsed nav + overlay; every interior page keeps Nav untouched.
export default function SiteNav() {
  const pathname = usePathname();
  return pathname === "/" ? <HomeNav /> : <Nav />;
}
