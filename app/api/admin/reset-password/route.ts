import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resetAdminPassword } from "@/lib/admin-password";

export async function POST(request: NextRequest) {
  const { recoveryCode, newPassword } = await request.json();

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

  if (typeof recoveryCode !== "string" || recoveryCode !== expectedCode) {
    return NextResponse.json({ error: "Incorrect recovery code" }, { status: 401 });
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  resetAdminPassword(newPassword);

  return NextResponse.json({ ok: true });
}
