import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/require-admin";
import { testimonialSchema } from "@/lib/validation/testimonial";
import { insertTestimonial } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid testimonial" },
      { status: 400 }
    );
  }

  const testimonial = insertTestimonial(parsed.data);
  revalidatePath("/", "layout");

  return NextResponse.json({ testimonial });
}
