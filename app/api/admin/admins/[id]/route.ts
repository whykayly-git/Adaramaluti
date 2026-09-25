import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { countAdmins, deleteAdmin, listAdmins } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const targetId = Number(id);
  const target = listAdmins().find((a) => a.id === targetId);

  if (!target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }
  if (target.email.toLowerCase() === session.email.toLowerCase()) {
    return NextResponse.json({ error: "You can't remove your own account" }, { status: 400 });
  }
  if (countAdmins() <= 1) {
    return NextResponse.json({ error: "Can't remove the last remaining admin" }, { status: 400 });
  }

  deleteAdmin(targetId);

  return NextResponse.json({ ok: true });
}
