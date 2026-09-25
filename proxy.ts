import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin-auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifySessionCookieValue(sessionCookie);
    if (!isValid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const response = NextResponse.next();
  const country =
    request.headers.get("x-vercel-ip-country") ??
    (request as unknown as { geo?: { country?: string } }).geo?.country ??
    "";

  response.cookies.set("adaramaluti-country", country, {
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export const config = {
  matcher: "/((?!_next|api|.*\\..*).*)",
};
