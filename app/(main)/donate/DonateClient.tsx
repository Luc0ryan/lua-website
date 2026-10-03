"use client";

import { useState } from "react";

// TODO: wire up your analytics system here
function trackEvent(name: string, props: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log("[trackEvent]", name, props);
  }
}

type Mode = "one_time" | "monthly";

// Monthly tiers sit low to make a recurring habit easy to say yes to;
// one-time tiers reach higher for people ready to give a larger single gift.
const PRESET_AMOUNTS: Record<Mode, number[]> = {
  one_time: [25, 50, 100, 250, 500],
  monthly: [5, 10, 25, 50, 100],
};

const DEFAULT_AMOUNT: Record<Mode, number> = {
  one_time: 50,
  monthly: 10,
};

const MODES: { value: Mode; label: string }[] = [
  { value: "one_time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
];

// Stroke-only tile shared by the frequency toggle and the amount grid;
// the selected state inverts to a solid fill.
function tileClass(active: boolean) {
  return `font-heading text-lg tracking-tight transition-colors cursor-pointer ${
    active ? "bg-fg text-bg" : "bg-white text-fg hover:bg-footer-bg"
  }`;
}

export function DonationForm() {
  const [mode, setMode] = useState<Mode>("one_time");
  // Per-mode selection so toggling never bleeds a shared value across preset lists.
  // `null` means the "Other" field is the active choice.
  const [selectedByMode, setSelectedByMode] = useState<Record<Mode, number | null>>(DEFAULT_AMOUNT);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const selected = selectedByMode[mode];
  const customIsActive = selected === null;
  const amount = customIsActive ? parseInt(custom, 10) : selected;
  const isValid = Number.isFinite(amount) && amount >= 1;

  function select(value: number | null) {
    setSelectedByMode((prev) => ({ ...prev, [mode]: value }));
    setErrorMsg("");
    if (value !== null) setCustom("");
  }

  function handleModeChange(next: Mode) {
    setMode(next);
    setCustom("");
    // Leaving "Other" empty on a mode switch would strand the form with no amount.
    setSelectedByMode((prev) =>
      prev[next] === null ? { ...prev, [next]: DEFAULT_AMOUNT[next] } : prev
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setErrorMsg("");

    trackEvent("donate_click", { amount, type: mode });

    const endpoint =
      mode === "one_time" ? "/api/stripe/checkout" : "/api/stripe/subscription";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: amount * 100 }),
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

  const submitLabel = !isValid
    ? "Enter an amount"
    : mode === "one_time"
      ? `Give $${amount.toLocaleString()}`
      : `Give $${amount.toLocaleString()} monthly`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* One-time / Monthly */}
      <div
        role="group"
        aria-label="Donation frequency"
        className="grid grid-cols-2 border-2 border-fg rounded-[2px] overflow-hidden divide-x-2 divide-fg"
      >
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleModeChange(value)}
            aria-pressed={mode === value}
            className={`py-3 ${tileClass(mode === value)}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 5 presets + an "Other" field as the sixth tile */}
      <div role="group" aria-label="Donation amount" className="grid grid-cols-3 gap-2">
        {PRESET_AMOUNTS[mode].map((amt) => (
          <button
            key={`${mode}-${amt}`}
            type="button"
            onClick={() => select(amt)}
            aria-pressed={selected === amt}
            className={`py-3 border-2 border-fg rounded-[2px] ${tileClass(selected === amt)}`}
          >
            ${amt}
          </button>
        ))}
        <label
          className={`relative flex items-center border-2 border-fg rounded-[2px] ${tileClass(customIsActive)}`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-3 ${customIsActive ? "text-bg" : "text-fg/50"}`}
          >
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Other"
            aria-label="Other amount in US dollars"
            value={custom}
            onFocus={() => select(null)}
            onChange={(e) => setCustom(e.target.value.replace(/\D/g, "").slice(0, 7))}
            className={`w-full min-w-0 bg-transparent py-3 pl-7 pr-2 text-center outline-none ${
              customIsActive ? "placeholder:text-bg/60" : "placeholder:text-fg/50"
            }`}
          />
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm font-sans text-red-700" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !isValid}
        data-event="donate_submit"
        className="mt-2 flex items-center justify-center gap-3 border-[3px] border-fg bg-lua-pink py-4 font-sans text-xl text-white shadow-[6px_6px_0_var(--fg)] transition-all duration-150 cursor-pointer hover:bg-fg active:translate-x-1.5 active:translate-y-1.5 active:shadow-none active:[transition:none] disabled:cursor-not-allowed disabled:bg-fg/40 disabled:shadow-none"
      >
        {status === "loading" ? (
          <>
            <span
              className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
            Redirecting to checkout…
          </>
        ) : (
          submitLabel
        )}
      </button>

      <p className="text-center font-sans text-sm text-text-muted">
        Secure checkout with Stripe. Tax-deductible.
      </p>
    </form>
  );
}
