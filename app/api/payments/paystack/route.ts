import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { initializePaystackTransaction, verifyPaystackTransaction } from "@/lib/payments/paystack";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amountNGN, reference, callbackUrl, metadata } = body as {
      email: string;
      amountNGN: number;
      reference: string;
      callbackUrl: string;
      metadata?: Record<string, unknown>;
    };

    if (!email || !amountNGN || !reference || !callbackUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = await initializePaystackTransaction({
      email,
      amountKobo: Math.round(amountNGN * 100),
      reference,
      callbackUrl,
      metadata,
    });

    return NextResponse.json({ authorizationUrl: data.authorization_url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const { successful, raw } = await verifyPaystackTransaction(reference);
    return NextResponse.json({ successful, status: raw.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
