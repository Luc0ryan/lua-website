import Link from "next/link";

const cols = [
  {
    heading: "PROJECTS",
    href: "/artworks",
    links: [],
  },
  {
    heading: "COMMUNITY",
    href: "/community",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    heading: "SERVICES",
    href: "/services",
    links: [
      { label: "Store", href: "/store" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-footer-bg relative overflow-hidden mt-auto">
      <div className="relative w-full max-w-6xl mx-auto px-gutter pt-12 pb-8">
        <div className="flex flex-col gap-8 mb-12 md:flex-row md:items-start md:justify-between">
          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {cols.map((col) => (
              <div key={col.heading}>
                <Link href={col.href} className="text-sm font-sans font-semibold tracking-widest uppercase text-fg mb-3 hover:text-pink transition-colors inline-block">
                  {col.heading}
                </Link>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm font-sans font-medium tracking-widest uppercase text-fg/60 hover:text-fg transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Us — pop art card */}
          <Link
            href="/contact"
            className="shrink-0 border-2 border-[#2B2B2B] bg-bg px-7 py-6 shadow-[3px_3px_0px_#2B2B2B] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#2B2B2B] md:min-w-55"
          >
            <p className="font-sans font-bold text-[30px] leading-tight text-[#2B2B2B] uppercase mb-3">
              CONTACT US
            </p>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[15px] text-[#2B2B2B]/70">
                Interested in collaborating?
              </span>
              <span className="text-lg text-[#2B2B2B]">›</span>
            </div>
          </Link>
        </div>

        {/* Copyright */}
        <div className="pt-6">
          <p className="text-xs font-sans text-fg/40 uppercase tracking-widest">
            © 2026 LOOKING UP ARTS
          </p>
        </div>
      </div>
    </footer>
  );
}
