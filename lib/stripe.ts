import Stripe from "stripe";

const MIN_DONATION_CENTS = 100; // $1
const MAX_DONATION_CENTS = 5_000_000; // $50,000 — larger gifts go through a person

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

/**
 * Canonical site origin for Stripe return URLs. Never derived from request
 * headers — `Origin` is client-controlled and would let a forged request send
 * donors to another domain after paying.
 */
export function getSiteUrl() {
  const url = process.env.SITE_URL;
  if (url) return url.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  throw new Error("Missing SITE_URL.");
}

/** Returns a validated amount in cents, or an error message for the donor. */
export function parseDonationAmount(body: unknown): { amountCents: number } | { error: string } {
  const amountCents = (body as { amountCents?: unknown } | null)?.amountCents;
  if (typeof amountCents !== "number" || !Number.isInteger(amountCents) || amountCents < MIN_DONATION_CENTS) {
    return { error: "Minimum donation is $1." };
  }
  if (amountCents > MAX_DONATION_CENTS) {
    return { error: "For gifts over $50,000, please contact us at info@lookingup.art." };
  }
  return { amountCents };
}

export function donationErrorMessage(err: unknown) {
  return err instanceof Stripe.errors.StripeError
    ? err.message
    : "Unable to start checkout. Please try again.";
}
