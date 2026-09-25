import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { collectionSchema } from "@/lib/validation/collection";
import { deleteCollection, getCollectionBySlugFromDb, updateCollection } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const collectionId = Number(id);
  const body = await request.json();
  const parsed = collectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid collection" }, { status: 400 });
  }

  const existingWithSlug = getCollectionBySlugFromDb(parsed.data.slug);
  if (existingWithSlug && existingWithSlug.id !== collectionId) {
    return NextResponse.json({ error: "A collection with that slug already exists" }, { status: 409 });
  }

  updateCollection(collectionId, parsed.data);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  deleteCollection(Number(id));
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
