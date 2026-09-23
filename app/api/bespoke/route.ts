import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { bespokeSchema } from "@/lib/validation/bespoke";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bespokeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // In production: send this to your CRM/email service (e.g. Resend, SendGrid)
  // and/or store it in a database for the design team to follow up on.
  console.log("New bespoke request:", parsed.data);

  return NextResponse.json({ ok: true });
}
