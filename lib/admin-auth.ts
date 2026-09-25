/**
 * Minimal password-gated session for /admin, implemented with Web Crypto
 * (rather than Node's `crypto` module) so the same verify function works
 * both in API routes (Node runtime) and in proxy.ts (Edge runtime).
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

export async function createSessionCookieValue(): Promise<string> {
  const expiry = String(Date.now() + SESSION_DURATION_MS);
  const signature = await sign(expiry, getSecret());
  return `${expiry}.${signature}`;
}

export async function verifySessionCookieValue(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const [expiry, signature] = value.split(".");
  if (!expiry || !signature) return false;
  if (!Number.isFinite(Number(expiry)) || Number(expiry) < Date.now()) return false;

  const expectedSignature = await sign(expiry, getSecret());
  return expectedSignature === signature;
}
