"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Heading } from "@/app/components/ui/Heading";

// TODO: wire up your analytics system here
function trackEvent(name: string, props: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log("[trackEvent]", name, props);
  }
}

const PRESET_AMOUNTS: Record<"one_time" | "monthly", number[]> = {
  one_time: [25, 50, 100, 250, 500],
  monthly: [5, 10, 25, 50, 100],
};

const DEFAULT_AMOUNT: Record<"one_time" | "monthly", number> = {
  one_time: 50,
  monthly: 10,
};

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

// ─── Trust strip ──────────────────────────────────────────────────────────────

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-fg/10 py-6 my-16 font-body text-xs text-fg/50">
      <span>501(c)(3) nonprofit</span>
      <span className="hidden sm:inline text-fg/20">·</span>
      <span>EIN: 82-5362991</span>
      <span className="hidden sm:inline text-fg/20">·</span>
      <span>All gifts are tax-deductible</span>
      <span className="hidden sm:inline text-fg/20">·</span>
      <StripeLockup />
    </div>
  );
}

// ─── Donation Form (one-time + monthly toggle) ────────────────────────────────

export function DonationForm() {
  const [mode, setMode] = useState<"one_time" | "monthly">("one_time");
  // Per-mode selection so toggling never bleeds a shared value across preset lists
  const [oneTimeSelected, setOneTimeSelected] = useState<number | null>(DEFAULT_AMOUNT.one_time);
  const [monthlySelected, setMonthlySelected] = useState<number | null>(DEFAULT_AMOUNT.monthly);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const customRef = useRef<HTMLInputElement>(null);

  const selected = mode === "one_time" ? oneTimeSelected : monthlySelected;
  function setSelected(val: number | null) {
    if (mode === "one_time") setOneTimeSelected(val);
    else setMonthlySelected(val);
  }

  const effectiveAmount =
    selected !== null ? selected : parseInt(custom, 10);
  const isValid = Number.isFinite(effectiveAmount) && effectiveAmount >= 1;
  const customIsActive = selected === null;

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setErrorMsg("");

    trackEvent("donate_click", { amount: effectiveAmount, type: mode });

    const endpoint =
      mode === "one_time"
        ? "/api/stripe/checkout"
        : "/api/stripe/subscription";

    try {
      const res = await fetch(endpoint, {
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
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <Heading as="h2" level="h3" className="leading-tight mb-2">
          Fund the work
        </Heading>
        <p className="font-body text-fg/60 text-sm leading-relaxed">
          Every contribution, whatever its size, goes directly to artists,
          materials, and making the work happen.
        </p>
      </div>

      {/* One-time / Monthly toggle */}
      <div
        role="group"
        aria-label="Donation frequency"
        className="flex w-full rounded-[4px] bg-footer-bg border border-fg/10 p-1"
      >
        <button
          type="button"
          onClick={() => { setMode("one_time"); setCustom(""); }}
          aria-pressed={mode === "one_time"}
          className={`flex-1 py-2.5 rounded-[3px] font-sans font-semibold text-sm transition-colors cursor-pointer ${
            mode === "one_time" ? "text-bg" : "text-fg/60 hover:text-fg"
          }`}
          style={mode === "one_time" ? { backgroundColor: "#B8622A" } : {}}
        >
          One-time
        </button>
        <button
          type="button"
          onClick={() => { setMode("monthly"); setCustom(""); }}
          aria-pressed={mode === "monthly"}
          className={`flex-1 py-2.5 rounded-[3px] font-sans font-semibold text-sm transition-colors cursor-pointer ${
            mode === "monthly" ? "text-bg" : "text-fg/60 hover:text-fg"
          }`}
          style={mode === "monthly" ? { backgroundColor: "#B8622A" } : {}}
        >
          Monthly
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5" noValidate>
        {/* 2 rows × 3 tiles: $10 $25 $50 / $100 $250 Other */}
        <div
          role="group"
          aria-label="Select a donation amount"
          className="grid grid-cols-3 gap-2"
        >
          {PRESET_AMOUNTS[mode].map((amt) => (
            <button
              key={`${mode}-${amt}`}
              type="button"
              onClick={() => handlePresetClick(amt)}
              aria-pressed={selected === amt}
              className={`py-3 rounded-sm font-sans font-semibold text-sm border transition-colors cursor-pointer ${
                selected === amt
                  ? "text-bg border-transparent"
                  : "bg-bg text-fg border-fg/20 hover:border-fg/60"
              }`}
              style={selected === amt ? { backgroundColor: "#B8622A" } : {}}
            >
              ${amt}
            </button>
          ))}
          <button
            type="button"
            onClick={handleOtherClick}
            aria-pressed={customIsActive}
            className={`py-3 rounded-sm font-sans font-semibold text-sm border transition-colors cursor-pointer ${
              customIsActive
                ? "text-bg border-transparent"
                : "bg-bg text-fg border-fg/20 hover:border-fg/60"
            }`}
            style={customIsActive ? { backgroundColor: "#B8622A" } : {}}
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
              className={`w-full bg-footer-bg border rounded pl-8 pr-4 py-3 font-body text-fg placeholder:text-fg/30 focus:outline-none transition-colors text-left ${
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
          className="w-full text-bg font-sans font-semibold tracking-widest uppercase py-4 rounded-sm transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-3"
          style={{ backgroundColor: "#B8622A" }}
        >
          {status === "loading" ? (
            <>
              <span
                className="inline-block w-4 h-4 border-2 border-bg/40 border-t-bg rounded-full animate-spin"
                aria-hidden="true"
              />
              Processing…
            </>
          ) : mode === "one_time" ? (
            "Give Now"
          ) : (
            "Give Monthly"
          )}
        </button>
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
        <strong>82-5362991</strong>. Contact us if your DAF sponsor needs
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
        <strong>82-5362991</strong>. You will receive a receipt for any gift
        made online.
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
