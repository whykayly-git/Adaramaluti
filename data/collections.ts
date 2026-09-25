import { listCollections, getCollectionBySlugFromDb } from "@/lib/db";
import type { Collection } from "@/types";

/**
 * Collections, backed by the SQLite database (see lib/db.ts) so they can be
 * edited from /admin/collections. Seeded once from data/seed-collections.ts.
 */

export function getAllCollections(): Collection[] {
  return listCollections();
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return getCollectionBySlugFromDb(slug);
}
