import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { getSetting, setSetting } from "@/lib/db";

/**
 * Node-only (uses Node's `crypto`, not Web Crypto) — only import this from
 * API routes, never from proxy.ts, which runs on the Edge runtime.
 */

const PASSWORD_HASH_KEY = "admin_password_hash";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const hash = scryptSync(password, salt, 64);
  const storedHash = Buffer.from(hashHex, "hex");
  if (hash.length !== storedHash.length) return false;

  return timingSafeEqual(hash, storedHash);
}

/**
 * Checks the DB-stored password hash first (set via a password reset); if
 * none has been set yet, falls back to the ADMIN_PASSWORD env var.
 */
export function verifyAdminPassword(password: string): boolean {
  const stored = getSetting(PASSWORD_HASH_KEY);
  if (stored) {
    return verifyHash(password, stored);
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  return typeof envPassword === "string" && envPassword.length > 0 && password === envPassword;
}

export function resetAdminPassword(newPassword: string): void {
  setSetting(PASSWORD_HASH_KEY, hashPassword(newPassword));
}
