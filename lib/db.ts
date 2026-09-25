import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

/**
 * Local SQLite file for storing bespoke/contact form submissions so they're
 * visible in the /admin dashboard instead of only appearing in server logs.
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
  if (!db) {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }
  return db;
}

export type SubmissionType = "bespoke" | "contact";

export interface Submission {
  id: number;
  type: SubmissionType;
  payload: Record<string, unknown>;
  createdAt: string;
}

export function insertSubmission(type: SubmissionType, payload: Record<string, unknown>): void {
  const database = getDb();
  const stmt = database.prepare(
    "INSERT INTO submissions (type, payload, created_at) VALUES (?, ?, ?)"
  );
  stmt.run(type, JSON.stringify(payload), new Date().toISOString());
}

export function getAllSubmissions(): Submission[] {
  const database = getDb();
  const rows = database.prepare("SELECT * FROM submissions ORDER BY id DESC").all() as {
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
