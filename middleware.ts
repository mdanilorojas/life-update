// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("life-update-session");
  const isAuthenticated = !!sessionCookie;

  // Note: We only check cookie existence here because middleware runs at the edge.
  // Actual session validation (expiration, server-side store lookup) happens in
  // API routes and server components via isAuthenticated() from lib/session.ts

  // Public routes that don't require authentication
  const isLoginPage = pathname === "/login";
  const isApiAuth = pathname.startsWith("/api/auth");
  const isPublicRoute = pathname === "/" || pathname.startsWith("/public") || pathname.startsWith("/_next");

  // Allow public routes
  if (isPublicRoute || isApiAuth) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthenticated && isLoginPage) {
    const dailyUrl = new URL("/daily", request.url);
    return NextResponse.redirect(dailyUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
