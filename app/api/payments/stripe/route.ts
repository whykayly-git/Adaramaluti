import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getStripeClient } from "@/lib/payments/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, currency, reference, successUrl, cancelUrl, productName, metadata } =
      body as {
        email: string;
        amount: number;
        currency: string;
        reference: string;
        successUrl: string;
        cancelUrl: string;
        productName: string;
        metadata?: Record<string, string>;
      };

    if (!email || !amount || !currency || !reference || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: reference,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(amount * 100),
            product_data: { name: productName || "Adaramaluti House of Fashion Order" },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { reference, ...metadata },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      successful: session.payment_status === "paid",
      status: session.payment_status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
