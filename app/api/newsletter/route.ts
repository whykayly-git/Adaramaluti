import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { insertNewsletterSubscriber } from "@/lib/db";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  insertNewsletterSubscriber(parsed.data.email);

  return NextResponse.json({ ok: true });
}
