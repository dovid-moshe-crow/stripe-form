import type { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: "2022-11-15" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { stripeToken, amount, months } = req.body;

  months = parseInt(months);

  if (isNaN(months) || months < 1 || months > 24) {
    return res.json({
      success: false,
      message: "monthes out of range",
    });
  }

  try {
    const customer = await stripe.customers.create({
      source: stripeToken,
    });

    const plan = await stripe.plans.create({
      amount: amount * 100,
      currency: "usd",
      interval: "month",
      product: {
        name: `${amount}$-donation`,
      },
    });

    const cancel_at = new Date();
    cancel_at.setMonth(cancel_at.getMonth() + months);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: plan.id, quantity: 1 }],
      metadata: {
        full_name: req.body.full_name,
        email: req.body.email,
        amb: req.body.amb,
        campaign: req.body.campaign,
        phone: req.body.phone,
      },
      cancel_at: Math.floor(cancel_at.getTime() / 1000),
      expand: ["latest_invoice.payment_intent"],
    });

    return res.redirect("/success");
  } catch (err: any) {
    return res.redirect(`/error?message=${err.raw.message}`);
  }
}
