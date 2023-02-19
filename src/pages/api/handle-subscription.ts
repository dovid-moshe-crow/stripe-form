import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: "2022-11-15" });
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.send({});

  const session = req.body.data.object;
  if (!session.metadata.months) {
    return; 
  }
  const months = parseInt(session.metadata?.months ?? "1");

  const cancel_at_date = new Date();
  cancel_at_date.setMonth(cancel_at_date.getMonth() + months);
  const cancel_at = Math.floor(cancel_at_date.getTime() / 1000);

  await stripe.subscriptions.update(session.subscription as any, {
    cancel_at,
  });
}
