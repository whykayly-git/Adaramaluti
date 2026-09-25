import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { siteSettingsSchema } from "@/lib/validation/settings";
import { updateSiteSettings } from "@/lib/site-settings";

export async function PUT(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid settings" }, { status: 400 });
  }

  updateSiteSettings(parsed.data);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
