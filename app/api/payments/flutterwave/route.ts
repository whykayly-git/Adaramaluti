import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  initializeFlutterwavePayment,
  verifyFlutterwaveTransaction,
} from "@/lib/payments/flutterwave";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, amount, currency, txRef, redirectUrl, metadata } = body as {
      email: string;
      name: string;
      amount: number;
      currency: string;
      txRef: string;
      redirectUrl: string;
      metadata?: Record<string, unknown>;
    };

    if (!email || !name || !amount || !currency || !txRef || !redirectUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = await initializeFlutterwavePayment({
      email,
      name,
      amount,
      currency,
      txRef,
      redirectUrl,
      metadata,
    });

    return NextResponse.json({ link: data.link });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get("transaction_id");
    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction_id" }, { status: 400 });
    }

    const { successful, raw } = await verifyFlutterwaveTransaction(transactionId);
    return NextResponse.json({ successful, status: raw.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
