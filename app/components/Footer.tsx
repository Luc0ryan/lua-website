import Link from "next/link";

const cols = [
  {
    heading: "ABOUT",
    links: [{ label: "Our Story", href: "/about" }, { label: "Team", href: "/team" }],
  },
  {
    heading: "PROJECTS",
    links: [{ label: "Artworks", href: "/artworks" }, { label: "Archive", href: "/archive" }],
  },
  {
    heading: "COMMUNITY",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Store", href: "/store" },
      { label: "Events", href: "/events" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    heading: "SERVICES",
    links: [{ label: "Commissions", href: "/commissions" }, { label: "Rentals", href: "/rentals" }],
  },
];

export default function Footer() {
  return (
    <footer className="bg-footer-bg mt-auto">
      <div className="w-full max-w-6xl mx-auto px-gutter pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-body font-medium tracking-widest text-fg mb-3">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm font-body text-fg/60 hover:text-fg transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between border-t border-fg/15 pt-6">
          <p className="text-xs font-body text-fg/40">© {new Date().getFullYear()} Looking Up Arts</p>
          <Link
            href="/contact"
            className="border border-fg/30 px-5 py-3 text-right hover:border-fg transition-colors"
          >
            <p className="text-[10px] font-body tracking-widest uppercase text-fg/50 mb-0.5">
              CONTACT US
            </p>
            <p className="text-sm font-heading font-semibold text-fg">
              Interested in collaborating?
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
