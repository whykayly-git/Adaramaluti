import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { productSchema } from "@/lib/validation/product";
import { deleteProduct, getProductBySlugFromDb, updateProduct } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product" }, { status: 400 });
  }

  const existingWithSlug = getProductBySlugFromDb(parsed.data.slug);
  if (existingWithSlug && existingWithSlug.id !== id) {
    return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  }

  updateProduct(id, { ...parsed.data, salePriceNGN: parsed.data.salePriceNGN ?? undefined });
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  deleteProduct(id);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
