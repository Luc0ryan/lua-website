export default function Editorial() {
  return (
    <section className="w-full max-w-6xl mx-auto px-gutter py-10 grid md:grid-cols-2 gap-16 items-center">
      <div className="overflow-hidden bg-neutral-200 relative aspect-4/3">
        <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center">
          <span className="text-xs font-body text-neutral-500">Editorial photo</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-body font-medium text-magenta mb-4">// we build local</p>
        <h2 className="text-4xl font-heading font-bold text-fg leading-tight mb-6">
          Transforming public space with every project
        </h2>
        <p className="text-base font-body text-fg/60 leading-relaxed">
          Looking Up Arts is a nonprofit studio shaping public spaces through light, creativity,
          and hands-on collaboration. We work with communities and cities to build work that
          energizes and inspires connection.
        </p>
      </div>
    </section>
  );
}
