import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: "2022-11-15" });

function logError(data: any) {
  try {
    axios.post(process.env.LOGGER_URL!, data, { timeout: 2000 });
  } catch {}
}

function differenceInMonths(date1: Date, date2: Date) {
  const monthDiff = date1.getMonth() - date2.getMonth();
  const yearDiff = date1.getFullYear() - date2.getFullYear();

  return monthDiff + yearDiff * 12;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
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
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      metadata: {
        full_name: req.body.full_name,
        email: req.body.email,
        amb: req.body.amb,
        campaign: req.body.campaign,
        phone: req.body.phone,
        dedication: req.body.dedication,
        anonymous: req.body.anonymous === "on" ? "true" : "false",
        months: months,
      },
    });

    // const intent = await stripe.paymentIntents.create({
    //   customer: customer.id,
    //   amount: amount * 100,
    //   currency: "usd",
    //   payment_method_types: ["card"],
    // });

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
      items: [
        {
          plan: plan.id,
          quantity: 1,
        },
      ],
      metadata: {
        full_name: req.body.full_name,
        email: req.body.email,
        amb: req.body.amb,
        campaign: req.body.campaign,
        phone: req.body.phone,
        dedication: req.body.dedication,
        anonymous: req.body.anonymous === "on" ? "true" : "false",
        months: months,
      },
      expand: ["latest_invoice.payment_intent"],
      cancel_at: Math.floor(cancel_at.getTime() / 1000),
    });

    return res.redirect(
      302,
      `/success?months=${differenceInMonths(
        new Date(subscription.cancel_at! * 1000),
        new Date(subscription.start_date * 1000)
      )}&amount=${
        (subscription.latest_invoice as any).payment_intent.amount / 100
      }`
    );
  } catch (err: any) {
    logError(err);
    return res.redirect(302, `/error?message=${err.raw.message}`);
  }
}
