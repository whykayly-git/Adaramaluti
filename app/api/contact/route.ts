import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // In production: forward this to your email service (e.g. Resend, SendGrid).
  console.log("New contact message:", parsed.data);

  return NextResponse.json({ ok: true });
}
