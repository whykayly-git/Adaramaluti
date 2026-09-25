import { listProducts, getProductBySlugFromDb } from "@/lib/db";
import type { Product } from "@/types";

/**
 * Product catalog, backed by the SQLite database (see lib/db.ts) so it can
 * be edited from /admin/shop. Seeded once from data/seed-products.ts.
 */

export function getAllProducts(): Product[] {
  return listProducts();
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProductBySlugFromDb(slug);
}

export function getFeaturedProducts(): Product[] {
  return listProducts().filter((p) => p.featured);
}

export function getNewArrivals(limit = 8): Product[] {
  return listProducts()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return listProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return listProducts().filter((p) => p.category === category);
}
