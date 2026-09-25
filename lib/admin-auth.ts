/**
 * Signed session cookie for /admin, implemented with Web Crypto (rather
 * than Node's `crypto` module) so the same verify function works both in
 * API routes (Node runtime) and in proxy.ts (Edge runtime).
 */

export const ADMIN_COOKIE_NAME = "adaramaluti_admin";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your .env.local file (see .env.example)."
    );
  }
  return secret;
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function encodeEmail(email: string): string {
  return btoa(encodeURIComponent(email)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeEmail(encoded: string): string | null {
  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    return decodeURIComponent(atob(padded));
  } catch {
    return null;
  }
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(signature);
}

export async function createSessionCookieValue(email: string): Promise<string> {
  const expiry = String(Date.now() + SESSION_DURATION_MS);
  const encodedEmail = encodeEmail(email);
  const payload = `${expiry}.${encodedEmail}`;
  const signature = await sign(payload, getSecret());
  return `${payload}.${signature}`;
}

export interface AdminSession {
  email: string;
}

/**
 * Verifies the session cookie and returns the signed-in admin's email, or
 * null if the cookie is missing, expired, or has an invalid signature.
 */
export async function verifySessionCookieValue(
  value: string | undefined | null
): Promise<AdminSession | null> {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [expiry, encodedEmail, signature] = parts;
  if (!expiry || !encodedEmail || !signature) return null;
  if (!Number.isFinite(Number(expiry)) || Number(expiry) < Date.now()) return null;

  const payload = `${expiry}.${encodedEmail}`;
  const expectedSignature = await sign(payload, getSecret());
  if (expectedSignature !== signature) return null;

  const email = decodeEmail(encodedEmail);
  if (!email) return null;

  return { email };
}
