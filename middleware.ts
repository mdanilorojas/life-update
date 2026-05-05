import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("authjs.session-token");
  const isLoggedIn = !!sessionCookie;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isApiAuth = pathname.startsWith("/api/auth");
  const isPublic = pathname === "/" || pathname.startsWith("/public");

  // Allow API auth routes and public routes
  if (isApiAuth || isPublic) {
    return NextResponse.next();
  }

  // If user is not logged in and trying to access protected routes
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
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
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
