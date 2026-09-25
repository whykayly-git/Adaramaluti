import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { shippingOptionsSchema } from "@/lib/validation/settings";
import { updateShippingOptions } from "@/lib/shipping";

export async function PUT(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = shippingOptionsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid shipping rates" }, { status: 400 });
  }

  updateShippingOptions(parsed.data);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
