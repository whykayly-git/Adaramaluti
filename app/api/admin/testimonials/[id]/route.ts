import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { testimonialSchema } from "@/lib/validation/testimonial";
import { deleteTestimonial, updateTestimonial } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid testimonial" },
      { status: 400 }
    );
  }

  updateTestimonial(Number(id), parsed.data);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  deleteTestimonial(Number(id));
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
