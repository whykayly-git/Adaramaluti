import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdminSession } from "@/lib/require-admin";

/**
 * Saves uploaded images to public/uploads so they're served directly by
 * Next.js, same pattern as the SQLite database: works great on a host with
 * a persistent disk, but resets on every deploy on an ephemeral/serverless
 * host (e.g. Vercel). Swap for a hosted object store (S3, Cloudinary,
 * Vercel Blob) before relying on this in that kind of deployment.
 */

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 8 * 1024 * 1024; // 8MB, generous enough for phone camera photos

export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WEBP or GIF images are allowed" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be smaller than 8MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
