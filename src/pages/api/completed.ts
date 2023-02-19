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

  return res.redirect(
    302,
    `/success?months=${months}&amount=${
      session.metadata?.amount
    }&name=${encodeURIComponent(session.metadata?.full_name ?? "")}`
  );
}
