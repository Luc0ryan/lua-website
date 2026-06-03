import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { amountCents } = (await req.json()) as { amountCents: number };

    if (!Number.isInteger(amountCents) || amountCents < 100) {
      return NextResponse.json(
        { error: "Minimum donation is $1." },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: "Donation — Looking Up Art",
              description:
                "Your gift directly supports artists and large-scale community art.",
            },
          },
        },
      ],
      payment_intent_data: {
        // Tags the charge clearly on donor bank statements
        statement_descriptor_suffix: "LOOKING UP ART",
        metadata: {
          organization: "Looking Up Art",
          donation_type: "one_time",
        },
      },
      // Pre-fill donor receipt email
      submit_type: "donate",
      success_url: `${origin}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?cancelled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : "Unable to start checkout. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
