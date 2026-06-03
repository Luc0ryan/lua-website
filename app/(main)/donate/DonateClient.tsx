"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// TODO: wire up your analytics system here
function trackEvent(name: string, props: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log("[trackEvent]", name, props);
  }
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

// ─── Stripe wordmark (inline SVG — official brand purple #635BFF) ─────────────

function StripeLockup() {
  return (
    <div className="flex items-center justify-center gap-1.5 text-xs font-body text-fg/40">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm.556 6.764c1.577 0 2.83.593 3.697 1.386l-1.546 1.856c-.6-.516-1.32-.857-2.151-.857-.912 0-1.474.432-1.474 1.056 0 .732.65.996 2.217 1.536 1.946.672 3.12 1.548 3.12 3.276 0 2.004-1.548 3.228-3.9 3.228-1.644 0-3.12-.648-4.08-1.692l1.608-1.8c.66.684 1.584 1.14 2.508 1.14.984 0 1.608-.42 1.608-1.116 0-.744-.576-1.032-2.04-1.536-2.1-.72-3.264-1.584-3.264-3.3 0-1.848 1.476-3.177 3.697-3.177z"
          fill="#635BFF"
        />
      </svg>
      <span>
        Secured by{" "}
        <span className="font-semibold" style={{ color: "#635BFF" }}>
          Stripe
        </span>
      </span>
    </div>
  );
}

// ─── Patreon wordmark ─────────────────────────────────────────────────────────

function PatreonLockup() {
  return (
    <div className="flex items-center gap-1.5 text-xs font-body text-fg/50">
      <svg width="12" height="14" viewBox="0 0 24 28" fill="none" aria-hidden="true">
        <circle cx="15.5" cy="9.5" r="8.5" fill="#FF424D" />
        <rect x="0" y="0" width="5.5" height="28" fill="#052D49" />
      </svg>
      <span>
        via{" "}
        <span className="font-bold" style={{ color: "#FF424D" }}>
          Patreon
        </span>
      </span>
    </div>
  );
}

// ─── Trust strip ──────────────────────────────────────────────────────────────

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-fg/10 py-6 my-16 font-body text-xs text-fg/50">
      <span>501(c)(3) nonprofit</span>
      <span className="hidden sm:inline text-fg/20">·</span>
      {/* TODO: insert EIN */}
      <span>EIN: [INSERT EIN]</span>
      <span className="hidden sm:inline text-fg/20">·</span>
      <span>All gifts are tax-deductible</span>
      <span className="hidden sm:inline text-fg/20">·</span>
      <StripeLockup />
    </div>
  );
}

// ─── One-Time Donation ────────────────────────────────────────────────────────

export function OneTimeDonation() {
  const [selected, setSelected] = useState<number | null>(25);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const customRef = useRef<HTMLInputElement>(null);

  const effectiveAmount =
    selected !== null ? selected : parseInt(custom, 10);
  const isValid = Number.isFinite(effectiveAmount) && effectiveAmount >= 1;

  function handlePresetClick(amt: number) {
    setSelected(amt);
    setCustom("");
    setErrorMsg("");
  }

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustom(e.target.value);
    setSelected(null);
    setErrorMsg("");
  }

  function handleOtherClick() {
    setSelected(null);
    customRef.current?.focus();
  }

  const customIsActive = selected === null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setErrorMsg("");

    trackEvent("donate_click", { amount: effectiveAmount, type: "one_time" });

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: effectiveAmount * 100 }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout. Please try again.");
      }

      window.location.href = data.url;
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="bg-bg border border-fg/10 rounded-lg p-8 md:p-10 flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-3xl font-bold leading-tight mb-2">
          Fund the work
        </h2>
        <p className="font-body text-fg/60 text-sm leading-relaxed">
          A one-time contribution of any size goes directly to artists,
          materials, and making the work happen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div
          role="group"
          aria-label="Select a donation amount"
          className="grid grid-cols-3 sm:grid-cols-6 gap-2"
        >
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handlePresetClick(amt)}
              aria-pressed={selected === amt}
              className={`py-3 rounded font-sans font-semibold text-sm border transition-colors cursor-pointer ${
                selected === amt
                  ? "bg-fg text-bg border-fg"
                  : "bg-bg text-fg border-fg/20 hover:border-fg/60"
              }`}
            >
              ${amt}
            </button>
          ))}
          <button
            type="button"
            onClick={handleOtherClick}
            aria-pressed={customIsActive}
            className={`py-3 rounded font-sans font-semibold text-sm border transition-colors cursor-pointer ${
              customIsActive
                ? "bg-fg text-bg border-fg"
                : "bg-bg text-fg border-fg/20 hover:border-fg/60"
            }`}
          >
            Other
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="custom-amount"
            className="text-xs font-sans font-semibold tracking-widest uppercase"
          >
            Or enter a custom amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-fg/50 select-none">
              $
            </span>
            <input
              ref={customRef}
              id="custom-amount"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="0"
              value={custom}
              onChange={handleCustomChange}
              className={`w-full bg-footer-bg border rounded pl-8 pr-4 py-3 font-body text-fg placeholder:text-fg/30 focus:outline-none transition-colors ${
                customIsActive ? "border-fg/60" : "border-fg/20 focus:border-fg/60"
              }`}
            />
          </div>
        </div>

        {status === "error" && (
          <p className="text-sm font-body text-red-600" role="alert">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !isValid}
          data-event="donate_submit"
          className="w-full bg-fg text-bg font-sans font-semibold tracking-widest uppercase py-4 rounded transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-3"
        >
          {status === "loading" ? (
            <>
              <span
                className="inline-block w-4 h-4 border-2 border-bg/40 border-t-bg rounded-full animate-spin"
                aria-hidden="true"
              />
              Processing…
            </>
          ) : (
            "Give Now"
          )}
        </button>

        <StripeLockup />
      </form>
    </div>
  );
}

// ─── Cancelled notice ─────────────────────────────────────────────────────────

export function CancelledNotice() {
  return (
    <div
      role="alert"
      className="bg-footer-bg border border-fg/10 rounded px-5 py-4 font-body text-sm text-fg/70"
    >
      Your checkout was cancelled — no charge was made. Feel free to try again whenever you&apos;re ready.
    </div>
  );
}

// ─── Patreon / Community ──────────────────────────────────────────────────────

export function RecurringDonation() {
  return (
    <div className="relative overflow-hidden bg-footer-bg border border-fg/10 rounded-lg p-8 md:p-10 flex flex-col gap-6">
      {/* Ben-day dot pattern — dense at bottom-right, dissolves toward upper-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C91F6E 2px, transparent 1.5px)",
          backgroundSize: "20px 20px",
          opacity: 0.30,
          maskImage:
            "radial-gradient(ellipse 90% 85% at 100% 100%, black 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 85% at 100% 100%, black 0%, transparent 72%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <h2 className="font-sans text-3xl font-bold leading-tight mb-2">
            Join the community
          </h2>
          <p className="font-body text-fg/70 text-sm leading-relaxed">
            Our Patreon community is the living core of what we do. Members
            get a front-row seat to the work — behind-the-scenes updates,
            early announcements, and the knowledge that their monthly support
            keeps Looking Up Art independent and free to take on ambitious
            projects.
          </p>
          <p className="font-body text-fg/60 text-sm mt-3 leading-relaxed">
            No transaction fees, no algorithms. Just a direct line between you
            and the art.
          </p>
        </div>

        {/* TODO: add Patreon tier names/amounts once client provides them */}
        {/* Example:
        <ul className="flex flex-col gap-2 border-t border-fg/10 pt-4">
          <li className="flex justify-between font-body text-sm text-fg/70">
            <span>Friend</span><span className="font-semibold">$5 / mo</span>
          </li>
          <li className="flex justify-between font-body text-sm text-fg/70">
            <span>Patron</span><span className="font-semibold">$15 / mo</span>
          </li>
          <li className="flex justify-between font-body text-sm text-fg/70">
            <span>Champion</span><span className="font-semibold">$50 / mo</span>
          </li>
        </ul>
        */}

        <div className="flex flex-col gap-3">
          <a
            href="[INSERT PATREON URL]" // TODO: replace with live Patreon URL
            target="_blank"
            rel="noopener noreferrer"
            data-event="patreon_click"
            onClick={() =>
              trackEvent("donate_click", { type: "recurring", platform: "patreon" })
            }
            className="inline-block text-center bg-fg text-bg font-sans font-semibold tracking-widest uppercase px-8 py-4 rounded transition-opacity hover:opacity-80"
          >
            Join on Patreon
          </a>
          <PatreonLockup />
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Can I donate with cryptocurrency?",
    a: (
      <>
        Yes. We accept crypto donations through{" "}
        <a
          href="https://thegivingblock.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-fg/70 transition-colors"
        >
          The Giving Block
        </a>{" "}
        {/* TODO: confirm which crypto giving platform the org uses */}
        — Bitcoin, Ethereum, and 60+ other cryptocurrencies. Crypto donations
        may be tax-deductible as charitable contributions of property.
      </>
    ),
  },
  {
    q: "Can I donate stock or securities?",
    a: (
      <>
        Yes. Donating appreciated stock directly to a nonprofit can be more
        tax-efficient than selling first. Please contact us at{" "}
        <a
          href="mailto:[INSERT EMAIL]" // TODO: insert contact email
          className="underline underline-offset-2 hover:text-fg/70 transition-colors"
        >
          [INSERT EMAIL]
        </a>{" "}
        to coordinate a stock transfer. Your financial advisor or broker can
        help initiate a DTC transfer to our brokerage account.
      </>
    ),
  },
  {
    q: "Can I set up a donor-advised fund (DAF) gift?",
    a: (
      <>
        Yes. Recommend a grant to Looking Up Art from your DAF. Our legal name
        is <strong>[INSERT LEGAL ORG NAME]</strong>
        {/* TODO: insert legal org name */} and our EIN is{" "}
        <strong>[INSERT EIN]</strong>
        {/* TODO: insert EIN */}. Contact us if your DAF sponsor needs
        additional information.
      </>
    ),
  },
  {
    q: "Can I donate by check?",
    a: (
      <>
        Yes. Make checks payable to <strong>Looking Up Art</strong> and mail
        to: <strong>[INSERT MAILING ADDRESS]</strong>
        {/* TODO: insert mailing address */}.
      </>
    ),
  },
  {
    q: "Are donations tax-deductible?",
    a: (
      <>
        Looking Up Art is a registered 501(c)(3) nonprofit. All donations are
        tax-deductible to the full extent allowed by law. Our EIN is{" "}
        <strong>[INSERT EIN]</strong>
        {/* TODO: insert EIN */}. You will receive a receipt for any gift made
        online.
      </>
    ),
  },
  {
    q: "Can my employer match my donation?",
    a: (
      <>
        Many employers offer matching gift programs that can double or triple
        your impact. Check with your HR department or search a matching gift
        database to see if your company participates. Contact us at{" "}
        <a
          href="mailto:[INSERT EMAIL]" // TODO: insert contact email
          className="underline underline-offset-2 hover:text-fg/70 transition-colors"
        >
          [INSERT EMAIL]
        </a>{" "}
        with any matching gift forms.
      </>
    ),
  },
];

function FaqAccordionItem({ q, a }: FaqItem) {
  const [open, setOpen] = useState(false);
  const id = `faq-${q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="border-b border-fg/10">
      <button
        type="button"
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left font-sans font-semibold text-base cursor-pointer hover:text-fg/70 transition-colors"
      >
        {q}
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        hidden={!open}
        className="pb-5 font-body text-fg/70 text-sm leading-relaxed"
      >
        {a}
      </div>
    </div>
  );
}

export function FaqAccordion() {
  return (
    <div className="flex flex-col gap-0">
      {FAQ_ITEMS.map((item) => (
        <FaqAccordionItem key={item.q} {...item} />
      ))}
    </div>
  );
}
