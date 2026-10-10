import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createOrderSchema } from "@/lib/validation/order";
import { insertPendingOrder } from "@/lib/db";

/**
 * Public (no admin session) — called by CheckoutClient right before
 * redirecting to the payment provider, so the order exists server-side
 * from the start instead of only in the customer's sessionStorage. The
 * payment verify routes (and the Stripe webhook) mark it "paid" once the
 * provider confirms the charge; this route only ever writes "pending".
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order" }, { status: 400 });
  }

  insertPendingOrder(parsed.data);

  return NextResponse.json({ ok: true });
}
