import { listLookbookImages } from "@/lib/db";
import type { LookbookImage } from "@/lib/db";

/**
 * Lookbook gallery, backed by the SQLite database (see lib/db.ts) so it can
 * be edited from /admin/lookbook. Seeded once from data/seed-lookbook.ts.
 */
export function getAllLookbookImages(): LookbookImage[] {
  return listLookbookImages();
}
