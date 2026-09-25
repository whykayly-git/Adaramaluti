import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { bespokeSchema } from "@/lib/validation/bespoke";
import { insertSubmission } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bespokeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  insertSubmission("bespoke", parsed.data);

  return NextResponse.json({ ok: true });
}
