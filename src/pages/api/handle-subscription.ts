import { setEngine } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: "2022-11-15" });
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id as any
  );
  const months = parseInt(session.metadata?.months ?? "1");

  const cancel_at_date = new Date();
  cancel_at_date.setMonth(cancel_at_date.getMonth() + months);
  const cancel_at = Math.floor(cancel_at_date.getTime() / 1000);

  await stripe.subscriptions.update(session.subscription as any, {
    cancel_at,
  });

  return res.redirect(
    302,
    `/success?months=${months}&amount=${
      session.metadata?.amount
    }&name=${encodeURIComponent(session.metadata?.full_name ?? "")}`
  );
}
