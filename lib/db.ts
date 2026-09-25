import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { seedProducts } from "@/data/seed-products";
import { seedCollections } from "@/data/seed-collections";
import { seedLookbookImages } from "@/data/seed-lookbook";
import type { Product, Collection } from "@/types";

/**
 * Local SQLite file backing the admin dashboard: form submissions, admin
 * accounts, and the product/collection/lookbook catalog (editable from
 * /admin instead of living in static code files).
 *
 * This works great for local use and for a host with a persistent disk. On
 * an ephemeral/serverless host (e.g. Vercel), this file resets on every
 * deploy and isn't shared across instances — swap it for a hosted database
 * (Turso, Supabase, Postgres) before relying on it in that kind of
 * production deployment.
 */

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "app.db");

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;

  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  db = new DatabaseSync(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      price_ngn INTEGER NOT NULL,
      sale_price_ngn INTEGER,
      category TEXT NOT NULL,
      collection TEXT NOT NULL,
      sizes TEXT NOT NULL,
      colors TEXT NOT NULL,
      images TEXT NOT NULL,
      description TEXT NOT NULL,
      in_stock INTEGER NOT NULL,
      featured INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS lookbook_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      alt TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  seedIfEmpty(db);

  return db;
}

function seedIfEmpty(database: DatabaseSync): void {
  const productCount = (
    database.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number }
  ).count;
  if (productCount === 0) {
    for (const p of seedProducts) {
      database
        .prepare(
          `INSERT INTO products
            (id, slug, name, price_ngn, sale_price_ngn, category, collection, sizes, colors, images, description, in_stock, featured, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          p.id,
          p.slug,
          p.name,
          p.priceNGN,
          p.salePriceNGN ?? null,
          p.category,
          p.collection,
          JSON.stringify(p.sizes),
          JSON.stringify(p.colors),
          JSON.stringify(p.images),
          p.description,
          p.inStock ? 1 : 0,
          p.featured ? 1 : 0,
          p.createdAt
        );
    }
  }

  const collectionCount = (
    database.prepare("SELECT COUNT(*) as count FROM collections").get() as { count: number }
  ).count;
  if (collectionCount === 0) {
    for (const c of seedCollections) {
      database
        .prepare(
          "INSERT INTO collections (slug, name, description, image) VALUES (?, ?, ?, ?)"
        )
        .run(c.slug, c.name, c.description, c.image);
    }
  }

  const lookbookCount = (
    database.prepare("SELECT COUNT(*) as count FROM lookbook_images").get() as { count: number }
  ).count;
  if (lookbookCount === 0) {
    seedLookbookImages.forEach((image, index) => {
      database
        .prepare(
          "INSERT INTO lookbook_images (url, alt, sort_order, created_at) VALUES (?, ?, ?, ?)"
        )
        .run(image.url, image.alt, index, new Date().toISOString());
    });
  }
}

// ---------- settings (generic key/value) ----------

export function getSetting(key: string): string | undefined {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value;
}

export function setSetting(key: string, value: string): void {
  getDb()
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(key, value);
}

// ---------- form submissions ----------

export type SubmissionType = "bespoke" | "contact";

export interface Submission {
  id: number;
  type: SubmissionType;
  payload: Record<string, unknown>;
  createdAt: string;
}

export function insertSubmission(type: SubmissionType, payload: Record<string, unknown>): void {
  getDb()
    .prepare("INSERT INTO submissions (type, payload, created_at) VALUES (?, ?, ?)")
    .run(type, JSON.stringify(payload), new Date().toISOString());
}

export function getAllSubmissions(): Submission[] {
  const rows = getDb().prepare("SELECT * FROM submissions ORDER BY id DESC").all() as {
    id: number;
    type: string;
    payload: string;
    created_at: string;
  }[];

  return rows.map((row) => ({
    id: row.id,
    type: row.type as SubmissionType,
    payload: JSON.parse(row.payload),
    createdAt: row.created_at,
  }));
}

// ---------- admin accounts ----------

export interface AdminAccount {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export function countAdmins(): number {
  return (getDb().prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number })
    .count;
}

export function getAdminByEmail(email: string): AdminAccount | undefined {
  const row = getDb()
    .prepare("SELECT * FROM admins WHERE email = ? COLLATE NOCASE")
    .get(email) as
    | { id: number; email: string; password_hash: string; created_at: string }
    | undefined;
  if (!row) return undefined;
  return { id: row.id, email: row.email, passwordHash: row.password_hash, createdAt: row.created_at };
}

export function listAdmins(): Omit<AdminAccount, "passwordHash">[] {
  const rows = getDb()
    .prepare("SELECT id, email, created_at FROM admins ORDER BY id ASC")
    .all() as { id: number; email: string; created_at: string }[];
  return rows.map((r) => ({ id: r.id, email: r.email, createdAt: r.created_at }));
}

export function insertAdmin(email: string, passwordHash: string): number {
  const result = getDb()
    .prepare("INSERT INTO admins (email, password_hash, created_at) VALUES (?, ?, ?)")
    .run(email.toLowerCase(), passwordHash, new Date().toISOString());
  return Number(result.lastInsertRowid);
}

export function updateAdminPasswordHash(email: string, passwordHash: string): void {
  getDb()
    .prepare("UPDATE admins SET password_hash = ? WHERE email = ? COLLATE NOCASE")
    .run(passwordHash, email);
}

export function deleteAdmin(id: number): void {
  getDb().prepare("DELETE FROM admins WHERE id = ?").run(id);
}

// ---------- products ----------

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price_ngn: number;
  sale_price_ngn: number | null;
  category: string;
  collection: string;
  sizes: string;
  colors: string;
  images: string;
  description: string;
  in_stock: number;
  featured: number;
  created_at: string;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    priceNGN: row.price_ngn,
    salePriceNGN: row.sale_price_ngn ?? undefined,
    category: row.category as Product["category"],
    collection: row.collection,
    sizes: JSON.parse(row.sizes),
    colors: JSON.parse(row.colors),
    images: JSON.parse(row.images),
    description: row.description,
    inStock: row.in_stock === 1,
    featured: row.featured === 1,
    createdAt: row.created_at,
  };
}

export function listProducts(): Product[] {
  const rows = getDb()
    .prepare("SELECT * FROM products ORDER BY created_at DESC")
    .all() as unknown as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductById(id: string): Product | undefined {
  const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getProductBySlugFromDb(slug: string): Product | undefined {
  const row = getDb().prepare("SELECT * FROM products WHERE slug = ?").get(slug) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : undefined;
}

export type ProductInput = Omit<Product, "id" | "createdAt">;

export function insertProduct(input: ProductInput): Product {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO products
        (id, slug, name, price_ngn, sale_price_ngn, category, collection, sizes, colors, images, description, in_stock, featured, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      input.slug,
      input.name,
      input.priceNGN,
      input.salePriceNGN ?? null,
      input.category,
      input.collection,
      JSON.stringify(input.sizes),
      JSON.stringify(input.colors),
      JSON.stringify(input.images),
      input.description,
      input.inStock ? 1 : 0,
      input.featured ? 1 : 0,
      createdAt
    );
  return { ...input, id, createdAt };
}

export function updateProduct(id: string, input: ProductInput): void {
  getDb()
    .prepare(
      `UPDATE products SET
        slug = ?, name = ?, price_ngn = ?, sale_price_ngn = ?, category = ?, collection = ?,
        sizes = ?, colors = ?, images = ?, description = ?, in_stock = ?, featured = ?
       WHERE id = ?`
    )
    .run(
      input.slug,
      input.name,
      input.priceNGN,
      input.salePriceNGN ?? null,
      input.category,
      input.collection,
      JSON.stringify(input.sizes),
      JSON.stringify(input.colors),
      JSON.stringify(input.images),
      input.description,
      input.inStock ? 1 : 0,
      input.featured ? 1 : 0,
      id
    );
}

export function deleteProduct(id: string): void {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

// ---------- collections ----------

interface CollectionRow {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
}

function rowToCollection(row: CollectionRow): Collection & { id: number } {
  return { id: row.id, slug: row.slug, name: row.name, description: row.description, image: row.image };
}

export function listCollections(): (Collection & { id: number })[] {
  const rows = getDb()
    .prepare("SELECT * FROM collections ORDER BY id ASC")
    .all() as unknown as CollectionRow[];
  return rows.map(rowToCollection);
}

export function getCollectionBySlugFromDb(slug: string): (Collection & { id: number }) | undefined {
  const row = getDb().prepare("SELECT * FROM collections WHERE slug = ?").get(slug) as
    | CollectionRow
    | undefined;
  return row ? rowToCollection(row) : undefined;
}

export function getCollectionById(id: number): (Collection & { id: number }) | undefined {
  const row = getDb().prepare("SELECT * FROM collections WHERE id = ?").get(id) as
    | CollectionRow
    | undefined;
  return row ? rowToCollection(row) : undefined;
}

export type CollectionInput = Omit<Collection, "id">;

export function insertCollection(input: CollectionInput): number {
  const result = getDb()
    .prepare("INSERT INTO collections (slug, name, description, image) VALUES (?, ?, ?, ?)")
    .run(input.slug, input.name, input.description, input.image);
  return Number(result.lastInsertRowid);
}

export function updateCollection(id: number, input: CollectionInput): void {
  getDb()
    .prepare("UPDATE collections SET slug = ?, name = ?, description = ?, image = ? WHERE id = ?")
    .run(input.slug, input.name, input.description, input.image, id);
}

export function deleteCollection(id: number): void {
  getDb().prepare("DELETE FROM collections WHERE id = ?").run(id);
}

// ---------- lookbook images ----------

export interface LookbookImage {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
  createdAt: string;
}

export function listLookbookImages(): LookbookImage[] {
  const rows = getDb()
    .prepare("SELECT * FROM lookbook_images ORDER BY sort_order ASC, id ASC")
    .all() as { id: number; url: string; alt: string; sort_order: number; created_at: string }[];
  return rows.map((r) => ({ id: r.id, url: r.url, alt: r.alt, sortOrder: r.sort_order, createdAt: r.created_at }));
}

export function insertLookbookImage(url: string, alt: string): LookbookImage {
  const database = getDb();
  const maxOrder = (
    database.prepare("SELECT MAX(sort_order) as maxOrder FROM lookbook_images").get() as {
      maxOrder: number | null;
    }
  ).maxOrder;
  const sortOrder = (maxOrder ?? -1) + 1;
  const createdAt = new Date().toISOString();
  const result = database
    .prepare("INSERT INTO lookbook_images (url, alt, sort_order, created_at) VALUES (?, ?, ?, ?)")
    .run(url, alt, sortOrder, createdAt);
  return { id: Number(result.lastInsertRowid), url, alt, sortOrder, createdAt };
}

export function deleteLookbookImage(id: number): void {
  getDb().prepare("DELETE FROM lookbook_images WHERE id = ?").run(id);
}
