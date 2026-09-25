import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resetAdminPasswordByEmail } from "@/lib/admin-password";

export async function POST(request: NextRequest) {
  const { email, recoveryCode, newPassword } = await request.json();

  const expectedCode = process.env.ADMIN_RECOVERY_CODE;
  if (!expectedCode) {
    return NextResponse.json(
      {
        error:
          "Password recovery is not configured. Set ADMIN_RECOVERY_CODE in your .env.local file.",
      },
      { status: 500 }
    );
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  if (typeof recoveryCode !== "string" || recoveryCode !== expectedCode) {
    return NextResponse.json({ error: "Incorrect recovery code" }, { status: 401 });
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const updated = resetAdminPasswordByEmail(email, newPassword);
  if (!updated) {
    return NextResponse.json({ error: "No admin account found for that email" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
