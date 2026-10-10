import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getStripeClient } from "@/lib/payments/stripe";
import { markOrderPaid } from "@/lib/db";

/**
 * Stripe requires the raw request body to verify the webhook signature,
 * so this route must not run through any body-parsing middleware.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const reference = session.metadata?.reference ?? session.client_reference_id;
    if (reference) {
      markOrderPaid(reference);
    } else {
      console.warn("Stripe checkout.session.completed with no order reference", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
