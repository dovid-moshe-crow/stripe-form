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

  // calculate months
  console.log(req.body);
  console.log(months);

  let months_num = null;
  if (req.body.multiSub != "on") {
    months_num = 1;
  } else if (months == "no limit") {
  } else {
    if (isNaN(months) || months < 1 || months > 24) {
      return res.json({
        success: false,
        message: "monthes out of range",
      });
    }

    months_num = parseInt(months);
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
        months: months_num,
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

    let cancel_at;
    if (months_num) {
      const cancel_at_date = new Date();
      cancel_at_date.setMonth(cancel_at_date.getMonth() + months_num);
      cancel_at = Math.floor(cancel_at_date.getTime() / 1000);
    }

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
        months: months_num,
      },
      expand: ["latest_invoice.payment_intent"],
      cancel_at,
    });

    console.log("hi");

    return res.redirect(
      302,
      `/success?months=${months_num}&amount=${
        (subscription.latest_invoice as any).payment_intent.amount / 100
      }&name=${encodeURIComponent(req.body.full_name)}`
    );
  } catch (err: any) {
    logError(err);
    return res.redirect(302, `/error?message=${err.raw.message}`);
  }
}
