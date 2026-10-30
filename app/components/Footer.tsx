"use client";

import Link from "next/link";
import { useState } from "react";

// lucide-react has no Instagram glyph — inline outline icon, currentColor so
// it matches text-fg like the label next to it.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const exploreLinks = [
  { label: "PROJECTS", href: "/projects" },
  { label: "COMMISSION", href: "/commission" },
  { label: "WHERE WE WORK", href: "/map" },
];

const getInvolvedLinks = [
  { label: "ABOUT", href: "/about" },
  { label: "DONATE", href: "/donate" },
  { label: "CONTACT US", href: "/contact" },
];

// Newsletter signup posts to its own HubSpot form (email-only — no
// firstname/lastname/message fields), kept separate from the Contact form's
// form ID (see ContactForm.tsx) so it doesn't fail HubSpot's required-field
// validation and so signups don't get lumped in with full inquiries in
// HubSpot reporting. Both forms live under the same portal.
// TODO: create the HubSpot form and set NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID
// in .env.local (NEXT_PUBLIC_HUBSPOT_PORTAL_ID is already set for Contact).
const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const NEWSLETTER_FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID;
const HUBSPOT_CONTACT_TYPE_ID = "0-1";
// NEXT_PUBLIC_* values are baked in at build time, so server and browser
// agree on this and the form never renders as a button that does nothing.
const newsletterReady = Boolean(PORTAL_ID && NEWSLETTER_FORM_ID);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newsletterReady) return;

    setStatus("loading");

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${NEWSLETTER_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { objectTypeId: HUBSPOT_CONTACT_TYPE_ID, name: "email", value: email },
            ],
            context: {
              pageUri: window.location.href,
              pageName: "Footer — Newsletter",
            },
          }),
        }
      );

      if (!res.ok) throw new Error(`Submission failed (${res.status})`);

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-footer-bg relative overflow-hidden mt-auto">
      <div className="max-w-screen-2xl mx-auto px-gutter pt-12 pb-10">
        {/* Nav columns + newsletter — first three grouped left, newsletter pinned right */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between mb-20">
          <div className="flex flex-wrap gap-x-16 gap-y-10">
            <div className="flex flex-col gap-4">
              <p className="text-base font-heading font-bold text-fg">EXPLORE LUA</p>
              <ul className="flex flex-col gap-4">
                {exploreLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-base font-heading font-medium text-text-muted hover:text-fg transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-base font-heading font-bold text-fg">GET INVOLVED</p>
              <ul className="flex flex-col gap-4">
                {getInvolvedLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-base font-heading font-medium text-text-muted hover:text-fg transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 w-[14.1875rem]">
              <p className="text-base font-heading font-bold text-fg">VISIT US</p>
              <p className="text-sm font-sans text-text-muted">
                <span className="font-medium">UPSIDE ARTSPACE</span>
                <br />
                1333 Minna St
                <br />
                San Francisco, CA 94103
                <br />
                <a
                  href="tel:+14159671333"
                  className="underline underline-offset-2 hover:text-fg transition-colors"
                >
                  (415) 967-1333
                </a>
                <br />
                <a
                  href="mailto:info@lookingup.art"
                  className="underline underline-offset-2 hover:text-fg transition-colors"
                >
                  info@lookingup.art
                </a>
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full max-w-[24.625rem] lg:shrink-0">
            <p className="text-xl font-heading font-bold text-fg tracking-tight mb-3">
              NEWSLETTER
            </p>
            {newsletterReady ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex items-stretch w-full">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 border-2 border-fg -mr-0.5 px-3 py-3 text-lg font-sans text-fg placeholder:text-text-muted bg-transparent outline-none focus:z-10 focus:relative"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="shrink-0 border-2 border-fg bg-lua-pink text-bg px-3 py-3 text-lg font-heading font-medium tracking-tight hover:opacity-85 transition-opacity disabled:opacity-60 cursor-pointer"
                >
                  {status === "loading" ? "…" : "SIGN UP"}
                </button>
              </div>
              <p className="text-base font-sans text-fg" aria-live="polite">
                {status === "success"
                  ? "Thanks — you're on the list!"
                  : status === "error"
                    ? "Something went wrong. Please try again."
                    : "New projects, workshops and stories to your inbox!"}
              </p>
            </form>
            ) : (
              <p className="text-base font-sans text-fg">
                Newsletter coming soon. For now, follow new projects on{" "}
                <a
                  href="https://www.instagram.com/lookinguparts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-lua-pink transition-colors"
                >
                  Instagram
                </a>
                .
              </p>
            )}
          </div>
        </div>

        {/* Wordmark + Instagram — wordmark left, follow link aligned to its top */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between mb-8">
          <p
            className="font-[family-name:var(--font-heading-narrow)] font-semibold text-fg leading-[0.85] break-words"
            style={{ fontSize: "clamp(2.25rem, 9vw, 7rem)", letterSpacing: "-0.06em" }}
          >
            LOOKING UP ARTS
          </p>

          <a
            href="https://www.instagram.com/lookinguparts/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base font-heading font-bold text-fg hover:text-lua-pink transition-colors shrink-0"
          >
            <InstagramIcon size={16} />
            FOLLOW US ON INSTAGRAM
          </a>
        </div>

        {/* Legal bar — nonprofit/EIN, site credit, copyright */}
        <div className="pt-6 border-t border-fg/10 flex flex-col gap-2 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p className="text-sm font-sans text-text-muted">
            Looking Up Arts is a registered 501(c)(3) nonprofit.{" "}
            <a
              href="https://projects.propublica.org/nonprofits/organizations/825362991"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-fg underline underline-offset-2 hover:text-lua-pink transition-colors"
            >
              EIN 82-5362991
            </a>
          </p>
          <p className="text-sm font-sans text-text-muted">
            Built By{" "}
            <a
              href="https://luc0ryan.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-fg transition-colors"
            >
              Lucas Ryan
            </a>
          </p>
          <p className="text-sm font-sans text-text-muted">
            © {new Date().getFullYear()} LOOKING UP ARTS
          </p>
        </div>
      </div>
    </footer>
  );
}
