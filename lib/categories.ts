/**
 * Kept separate from data/products.ts (which is DB-backed and Node-only)
 * so client components can import the category list without pulling in
 * node:sqlite into the browser bundle.
 */
export const categories = ["Dresses", "Suits", "Native Wear", "Accessories"] as const;
