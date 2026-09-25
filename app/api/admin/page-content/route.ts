import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { pageContentSchema } from "@/lib/validation/settings";
import { setPageContent } from "@/lib/page-content";

export async function PUT(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = pageContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid content" }, { status: 400 });
  }

  setPageContent(parsed.data.key, parsed.data.content);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
