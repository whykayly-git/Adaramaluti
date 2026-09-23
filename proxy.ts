import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
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
