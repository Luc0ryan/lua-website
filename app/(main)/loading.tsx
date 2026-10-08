// Shown while any (main) route streams in (e.g. /projects, /projects/[slug],
// /map fetch from Sanity). It renders inside the (main) layout, so the nav and
// footer stay put; only the page body is swapped for this skeleton.
export default function Loading() {
  return (
    <main
      className="mx-auto w-full max-w-screen-2xl flex-1 px-gutter py-12"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-10 w-2/3 max-w-xl animate-pulse rounded-[2px] bg-neutral-200" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-[2px] bg-neutral-200" />
        ))}
      </div>
    </main>
  );
}
