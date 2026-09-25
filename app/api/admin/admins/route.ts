import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { createAdmin } from "@/lib/admin-password";
import { getAdminByEmail } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, password } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }
  if (getAdminByEmail(email)) {
    return NextResponse.json({ error: "An admin with that email already exists" }, { status: 409 });
  }

  createAdmin(email, password);

  return NextResponse.json({ ok: true });
}
