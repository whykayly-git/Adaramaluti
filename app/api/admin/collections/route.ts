import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { collectionSchema } from "@/lib/validation/collection";
import { getCollectionBySlugFromDb, insertCollection } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = collectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid collection" }, { status: 400 });
  }

  if (getCollectionBySlugFromDb(parsed.data.slug)) {
    return NextResponse.json({ error: "A collection with that slug already exists" }, { status: 409 });
  }

  const id = insertCollection(parsed.data);
  revalidatePath("/", "layout");

  return NextResponse.json({ id });
}
