import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isApiAuth = pathname.startsWith("/api/auth");
  const isPublic = pathname === "/" || pathname.startsWith("/public");

  // Allow API auth routes and public routes
  if (isApiAuth || isPublic) {
    return null;
  }

  // If user is not logged in and trying to access protected routes
  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }

  // If user is logged in and trying to access auth pages, redirect to daily
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/daily", req.nextUrl.origin));
  }

  return null;
});

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
