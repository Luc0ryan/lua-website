import { NextRequest, NextResponse } from "next/server";
import { getStripe, getSiteUrl, parseDonationAmount, donationErrorMessage } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const parsed = parseDonationAmount(await req.json().catch(() => null));
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { amountCents } = parsed;

    const stripe = getStripe();
    const origin = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: "Donation — Looking Up Arts",
              description:
                "Your gift directly supports artists and large-scale community art.",
            },
          },
        },
      ],
      payment_intent_data: {
        // Tags the charge clearly on donor bank statements
        statement_descriptor_suffix: "LOOKING UP ARTS",
        metadata: {
          organization: "Looking Up Arts",
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
    return NextResponse.json({ error: donationErrorMessage(err) }, { status: 500 });
  }
}
