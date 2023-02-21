import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: "2022-11-15" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  try {
    const amount = parseInt(req.body.amount);
    const months = parseInt(req.body.months);
    const metadata = req.body;

    const session = await stripe.checkout.sessions.create({
      customer_creation: months == 1 ? "always" : undefined,
      payment_intent_data:
        months == 1
          ? {
              metadata,
            }
          : undefined,
      subscription_data:
        months == 1
          ? undefined
          : {
              metadata,
            },
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: getProductName(amount, months),
              metadata,
            },
            currency: "usd",
            recurring: months == 1 ? undefined : { interval: "month" },
            unit_amount: amount * 100,
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/api/completed?session_id={CHECKOUT_SESSION_ID}`,
      mode: months == 1 ? "payment" : "subscription",
      metadata,
    });

    res.redirect(302, session.url!);
  } catch (err: any) {
    const message = err?.message?.raw ?? err.message ?? err?.toString();

    return res.redirect(302, `/error?message=${encodeURIComponent(message)}`);
  }
}

const getProductName = (amount: number, months: number) => {
  if (months == 0) return `${amount} dolars a month`;
  if (months == 1) return `${amount} dolar donation`;
  else return `${months} monthes`;
};
