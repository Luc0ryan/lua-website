"use client";

import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";

// Matches the loose SanityImageSource type used throughout this codebase.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

interface ContactFormProps {
  /**
   * Optional Sanity image object. When provided the static fallback is ignored.
   * Wire this up from a `contactPage` Sanity document when that schema exists.
   */
  sanityImage?: SanityImageSource;
  /** Contact email shown above the heading. Defaults to info@lookingup.art */
  email?: string;
}

// Set via .env.local — NEXT_PUBLIC_ so the browser can POST directly to HubSpot.
const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;

export default function ContactForm({
  sanityImage,
  email = "info@lookingup.art",
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    newsletter: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Prefer a Sanity-sourced image; fall back to static placeholder.
  const imageSrc = sanityImage
    ? urlFor(sanityImage).width(900).url()
    : "/images/contactHero.webp";
  const imageAlt = sanityImage?.alt ?? "Looking Up Art — contact";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      if (!PORTAL_ID || !FORM_ID) {
        throw new Error(
          "HubSpot credentials are not configured. " +
            "Add NEXT_PUBLIC_HUBSPOT_PORTAL_ID and NEXT_PUBLIC_HUBSPOT_FORM_ID to .env.local."
        );
      }

      // HubSpot Forms Submissions API v3.
      // Field `name` values must match the internal names in your HubSpot form:
      //   firstname     → default Contact property
      //   lastname      → default Contact property (empty string if single name given)
      //   email         → default Contact property
      //   message       → create a multi-line text Contact property named "message"
      //   newsletter_opt_in → create a single checkbox Contact property named "newsletter_opt_in"

      // Split "First Last" → firstname / lastname. If only one token is given the
      // whole value becomes firstname and lastname is left blank.
      const [firstName, ...rest] = form.name.trim().split(/\s+/);
      const lastName = rest.join(" ");

      const payload = {
        fields: [
          { objectTypeId: "0-1", name: "firstname", value: firstName },
          { objectTypeId: "0-1", name: "lastname", value: lastName },
          { objectTypeId: "0-1", name: "email", value: form.email },
          { objectTypeId: "0-1", name: "message", value: form.message },
          {
            objectTypeId: "0-1",
            name: "newsletter_opt_in",
            value: form.newsletter ? "true" : "false",
          },
        ],
        context: {
          pageUri: typeof window !== "undefined" ? window.location.href : "",
          pageName: "Contact — Get in Touch",
        },
      };

      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? `Submission failed (${res.status})`);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section className="flex-1 flex flex-col lg:flex-row min-h-screen pt-20">
      {/* ── Left: image ───────────────────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[45%] shrink-0 pr-4">
        <div className="relative w-full h-full rounded-r-2xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* ── Right: form ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-gutter py-16">
        <div className="max-w-lg w-full mx-auto lg:mx-0">
          {/* Email link */}
          <p className="text-sm font-body mb-6">
            Email:{" "}
            <a
              href={`mailto:${email}`}
              className="underline underline-offset-2 hover:text-fg/70 transition-colors"
            >
              {email}
            </a>
          </p>

          {/* ── Success state ── */}
          {status === "success" ? (
            <div className="py-4">
              <h1 className="font-sans text-5xl font-bold leading-tight mb-4">
                Thank you.
              </h1>
              <p className="font-body text-fg/70 text-base leading-relaxed">
                We&apos;ve received your message and will be in touch soon.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-sans text-5xl font-bold leading-tight mb-3">
                Start the conversation
              </h1>
              <p className="font-body font-semibold text-fg mb-8 text-base">
                Request our full art deck and get in touch
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-sans font-semibold tracking-widest uppercase"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-footer-bg border border-fg/20 rounded px-4 py-3 font-body text-fg placeholder:text-fg/30 focus:outline-none focus:border-fg/60 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-sans font-semibold tracking-widest uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="bg-footer-bg border border-fg/20 rounded px-4 py-3 font-body text-fg placeholder:text-fg/30 focus:outline-none focus:border-fg/60 transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-sans font-semibold tracking-widest uppercase"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="bg-footer-bg border border-fg/20 rounded px-4 py-3 font-body text-fg placeholder:text-fg/30 focus:outline-none focus:border-fg/60 transition-colors resize-none"
                  />
                </div>

                {/* Newsletter opt-in */}
                <label className="flex gap-3 items-start cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, newsletter: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 shrink-0 accent-fg"
                  />
                  <span className="font-body text-sm text-fg/80 leading-snug">
                    <strong>Keep me in the loop!</strong> Project updates, community
                    opportunities, and the occasional love letter from the studio.
                  </span>
                </label>

                {/* Error message */}
                {status === "error" && (
                  <p className="text-sm font-body text-red-600" role="alert">
                    {errorMsg}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-fg text-bg font-sans font-semibold tracking-widest uppercase py-4 rounded transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
                >
                  {status === "loading" ? "Sending…" : "Submit"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
