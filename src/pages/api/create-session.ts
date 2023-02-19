import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: "2022-11-15" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await stripe.checkout.sessions.create({
      metadata: req.body,
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: `donation-${req.body.amount}`,
              metadata: req.body,
            },
            currency: "usd",
            recurring: { interval: "month" },
            unit_amount: parseInt(req.body.amount) * 100,
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/api/completed?session_id={CHECKOUT_SESSION_ID}`,

      mode: "subscription",
    });

    res.redirect(302, session.url!);
  } catch (err: any) {
    const message = err?.message?.raw ?? err.message ?? err?.toString();

    return res.redirect(302, `/error?message=${encodeURIComponent(message)}`);
  }
}
