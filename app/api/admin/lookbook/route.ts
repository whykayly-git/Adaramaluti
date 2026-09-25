import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { insertLookbookImage } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url, alt } = await request.json();

  if (typeof url !== "string" || !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: "Enter a valid image URL" }, { status: 400 });
  }

  const image = insertLookbookImage(url, typeof alt === "string" && alt.trim() ? alt : "Adaramaluti lookbook editorial");

  return NextResponse.json({ image });
}
