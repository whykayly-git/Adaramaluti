import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionCookieValue, type AdminSession } from "@/lib/admin-auth";

/**
 * proxy.ts only gates page routes under /admin (its matcher excludes
 * /api entirely), so every mutating /api/admin/* route must check the
 * session itself — otherwise it would be reachable by anyone who can
 * guess the URL, session or no session.
 */
export async function requireAdminSession(request: NextRequest): Promise<AdminSession | null> {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionCookieValue(cookie);
}

/** Same check, for use in Server Components/pages (via next/headers) rather than route handlers. */
export async function getAdminSessionForPage(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionCookieValue(cookie);
}
