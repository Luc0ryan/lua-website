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
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            recurring: { interval: "month" },
            product_data: {
              name: "Monthly Donation — Looking Up Arts",
              description:
                "Your monthly gift directly supports artists and large-scale community art.",
            },
          },
        },
      ],
      subscription_data: {
        metadata: {
          organization: "Looking Up Arts",
          donation_type: "monthly",
        },
      },
      success_url: `${origin}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?cancelled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/subscription]", err);
    return NextResponse.json({ error: donationErrorMessage(err) }, { status: 500 });
  }
}
