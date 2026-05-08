import Link from "next/link";

const igCount = 8;

export default function InstagramGrid() {
  return (
    <section className="max-w-6xl mx-auto px-8 pb-16">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: igCount }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-200 overflow-hidden relative aspect-square"
          >
            <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center">
              <span className="text-xs font-body text-neutral-400">IG</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <Link
          href="https://www.instagram.com/lookinguparts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-body font-medium text-fg hover:text-[#E8197D] transition-colors"
        >
          Follow us on instagram →
        </Link>
      </div>
    </section>
  );
}
