import { notFound } from "next/navigation";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Heading } from "@/app/components/ui/Heading";
import { Text } from "@/app/components/ui/Text";

const colors = [
  { name: "--fg", label: "Foreground", hex: "#1C1410", bg: "bg-fg", text: "text-bg" },
  { name: "--bg", label: "Background", hex: "#FFFFFF", bg: "bg-bg", text: "text-fg", border: true },
  { name: "--pink", label: "Pink", hex: "#DC738F", bg: "bg-pink", text: "text-bg" },
  { name: "--lua-pink", label: "Lua Pink", hex: "#C91F6E", bg: "bg-lua-pink", text: "text-bg" },
  { name: "--footer-bg", label: "Footer BG", hex: "#F5F3F0", bg: "bg-footer-bg", text: "text-fg", border: true },
  { name: "--gray-label", label: "Gray Label", hex: "#888888", bg: "bg-gray-label", text: "text-bg" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 border-t border-fg/10">
      <Text variant="label" className="mb-6 block">{title}</Text>
      {children}
    </section>
  );
}

// Internal reference page: available in `next dev`, 404 in production.
export default function DesignPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="px-gutter max-w-5xl mx-auto pb-24">
      <div className="pt-16 pb-10">
        <Heading level="h1" className="mb-3">Design System</Heading>
        <Text variant="muted">Tokens, primitives, and patterns for lua-website.</Text>
      </div>

      {/* Colors */}
      <Section title="Colors">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {colors.map((c) => (
            <div key={c.name}>
              <div
                className={`${c.bg} ${c.border ? "border border-fg/20" : ""} h-20 w-full mb-2`}
              />
              <Text size="sm" className="font-medium block">{c.label}</Text>
              <Text variant="muted" size="sm">{c.hex}</Text>
              <Text variant="muted" size="sm" className="font-mono">{c.name}</Text>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-6">
          <div>
            <Text variant="label" className="mb-4 block">Archivo — font-heading</Text>
            <div className="space-y-3">
              <Heading as="h2" level="display">Display</Heading>
              <Heading level="h1">Heading One</Heading>
              <Heading level="h2">Heading Two</Heading>
              <Heading level="h3">Heading Three</Heading>
              <Heading level="h4">Heading Four</Heading>
            </div>
            <Text variant="muted" size="sm" className="mt-3 block">
              Display is fluid (clamp, scales continuously with viewport) — reserve it for one-off
              hero/section-opener moments, not routine section headings. Weight defaults to bold;
              pass <code className="font-mono">weight=&quot;normal&quot;</code> etc. to override any level.
            </Text>
          </div>
          <div className="border-t border-fg/10 pt-6">
            <Text variant="label" className="mb-4 block">DM Sans — font-sans</Text>
            <div className="space-y-6">
              <div>
                <Text variant="muted" size="sm" className="mb-1 block">lg — 18px</Text>
                <p className="font-sans text-lg font-normal leading-relaxed max-w-2xl">
                  Lua Collective is a community of artists and creatives working across photography, design, and visual culture. We believe in the power of images to shift perspective.
                </p>
              </div>
              <div>
                <Text variant="muted" size="sm" className="mb-1 block">md — 16px (default)</Text>
                <p className="font-sans text-base font-normal leading-relaxed max-w-2xl">
                  Lua Collective is a community of artists and creatives working across photography, design, and visual culture. We believe in the power of images to shift perspective.
                </p>
              </div>
              <div>
                <Text variant="muted" size="sm" className="mb-1 block">sm — 14px</Text>
                <p className="font-sans text-sm font-normal leading-relaxed max-w-2xl">
                  Lua Collective is a community of artists and creatives working across photography, design, and visual culture. We believe in the power of images to shift perspective.
                </p>
              </div>
              <div>
                <Text variant="muted" size="sm" className="mb-2 block">Weights</Text>
                <div className="space-y-1.5 font-sans text-base">
                  <p className="font-normal">Regular 400 — The quick brown fox jumps over the lazy dog.</p>
                  <p className="font-medium">Medium 500 — The quick brown fox jumps over the lazy dog.</p>
                  <p className="font-semibold">Semibold 600 — The quick brown fox jumps over the lazy dog.</p>
                  <p className="font-bold">Bold 700 — The quick brown fox jumps over the lazy dog.</p>
                  <p className="font-extrabold">Extrabold 800 — The quick brown fox jumps over the lazy dog.</p>
                </div>
              </div>
              <div>
                <Text variant="muted" size="sm" className="mb-2 block">Variants</Text>
                <div className="space-y-1.5 font-sans text-base">
                  <p className="text-fg">Default — primary body copy</p>
                  <p className="text-fg/50">Muted — secondary text, captions</p>
                  <p className="text-xs font-semibold tracking-widest uppercase text-fg/70">Label — form labels, eyebrows, tags</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="space-y-8">
          <div>
            <Text variant="label" className="mb-4 block">Brutalist — nav &amp; CTA</Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="brutalist" size="sm">Small</Button>
              <Button variant="brutalist" size="md">Medium</Button>
              <Button variant="brutalist" size="lg">Large</Button>
            </div>
          </div>
          <div>
            <Text variant="label" className="mb-4 block">Solid — form submit</Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="solid" size="sm">Small</Button>
              <Button variant="solid" size="md">Medium</Button>
              <Button variant="solid" size="lg">Large</Button>
            </div>
          </div>
          <div>
            <Text variant="label" className="mb-4 block">Ghost — inline actions</Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="ghost" size="sm">Small</Button>
              <Button variant="ghost" size="md">Medium</Button>
              <Button variant="ghost" size="lg">Large</Button>
            </div>
          </div>
          <div>
            <Text variant="label" className="mb-4 block">States</Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="solid" disabled>Disabled</Button>
              <Button variant="brutalist" disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-2 items-start">
            <Badge variant="default">Default</Badge>
            <Text variant="muted" size="sm">default</Text>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <Badge variant="pink">Category</Badge>
            <Text variant="muted" size="sm">pink</Text>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <Badge variant="solid">Featured</Badge>
            <Text variant="muted" size="sm">solid</Text>
          </div>
        </div>
        <div className="mt-6 p-4 bg-footer-bg">
          <Text variant="label" className="mb-1 block">In context — card eyebrow</Text>
          <Badge variant="default">Sydney, Australia</Badge>
          <Heading level="h3" className="mt-1">Artwork Title Here</Heading>
        </div>
      </Section>

      {/* Spacing */}
      <Section title="Spacing &amp; Layout">
        <div className="space-y-4">
          <div>
            <Text variant="label" className="mb-2 block">--gutter — clamp(24px, 4vw, 64px)</Text>
            <Text variant="muted" size="sm">
              The single source of truth for horizontal rhythm. Used via{" "}
              <code className="font-mono text-fg/70">px-gutter</code>,{" "}
              <code className="font-mono text-fg/70">mx-gutter</code>,{" "}
              <code className="font-mono text-fg/70">gap-gutter</code>.
            </Text>
          </div>
          <div className="border border-fg/20 relative">
            <div className="bg-pink/20 h-12 px-gutter flex items-center">
              <div className="bg-pink/40 h-2 w-full" />
            </div>
            <div className="absolute left-0 top-0 bottom-0 bg-pink/30 w-gutter" />
            <div className="absolute right-0 top-0 bottom-0 bg-pink/30 w-gutter" />
            <Text variant="muted" size="sm" className="px-2 py-1">← gutter →</Text>
          </div>
        </div>
      </Section>

      {/* Hover / Motion */}
      <Section title="Interactions">
        <div className="space-y-4">
          <Text variant="label" className="block">Hover scale on images</Text>
          <Text variant="muted" size="sm">
            Standard:{" "}
            <code className="font-mono text-fg/70">
              group-hover:scale-[1.03] transition-transform duration-500 ease-out
            </code>
            {" "}on the image, with <code className="font-mono text-fg/70">group</code> on the wrapper.
          </Text>
          <div className="group overflow-hidden w-48 h-32 bg-footer-bg border border-fg/10 cursor-pointer">
            <div className="w-full h-full bg-fg/10 group-hover:scale-[1.03] transition-transform duration-500 ease-out flex items-center justify-center">
              <Text variant="muted" size="sm">Hover me</Text>
            </div>
          </div>
          <Text variant="label" className="block mt-6">Focus ring</Text>
          <Text variant="muted" size="sm">
            <code className="font-mono text-fg/70">
              focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink
            </code>
          </Text>
          <div className="flex gap-4">
            <Button variant="solid">Tab to me</Button>
            <Button variant="brutalist">Tab to me</Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
