import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { countAdmins, getAdminByEmail, insertAdmin, updateAdminPasswordHash } from "@/lib/db";

/**
 * Node-only (uses Node's `crypto`, not Web Crypto) — only import this from
 * API routes, never from proxy.ts, which runs on the Edge runtime.
 */

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

function isBootstrapMatch(email: string, password: string): boolean {
  const bootstrapEmail = process.env.ADMIN_EMAIL;
  const bootstrapPassword = process.env.ADMIN_PASSWORD;
  if (!bootstrapEmail || !bootstrapPassword) return false;
  return email.toLowerCase() === bootstrapEmail.toLowerCase() && password === bootstrapPassword;
}

/**
 * Verifies email+password against the admins table. If no admin accounts
 * exist yet, falls back to the ADMIN_EMAIL / ADMIN_PASSWORD env vars and
 * creates that first account on success — this is how you get in the very
 * first time, before you can invite anyone from inside the dashboard.
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  const existing = getAdminByEmail(email);
  if (existing) {
    return verifyHash(password, existing.passwordHash);
  }

  if (countAdmins() === 0 && isBootstrapMatch(email, password)) {
    insertAdmin(email, hashPassword(password));
    return true;
  }

  return false;
}

export function createAdmin(email: string, password: string): void {
  insertAdmin(email, hashPassword(password));
}

/**
 * Resets a given admin's password using the recovery code flow. If that
 * email doesn't have an account yet but matches the bootstrap email (and no
 * admins exist), this creates the account instead.
 */
export function resetAdminPasswordByEmail(email: string, newPassword: string): boolean {
  const existing = getAdminByEmail(email);
  if (existing) {
    updateAdminPasswordHash(email, hashPassword(newPassword));
    return true;
  }

  if (countAdmins() === 0 && email.toLowerCase() === (process.env.ADMIN_EMAIL ?? "").toLowerCase()) {
    insertAdmin(email, hashPassword(newPassword));
    return true;
  }

  return false;
}
