import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { productSchema } from "@/lib/validation/product";
import { getProductBySlugFromDb, insertProduct } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product" }, { status: 400 });
  }

  if (getProductBySlugFromDb(parsed.data.slug)) {
    return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  }

  const product = insertProduct({ ...parsed.data, salePriceNGN: parsed.data.salePriceNGN ?? undefined });

  return NextResponse.json({ product });
}
