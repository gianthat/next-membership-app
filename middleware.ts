import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect routes with middleware
export default withAuth(
  function middleware(req) {
    const role = req.nextauth?.token?.role;

    // Restrict /admin to admins only
    if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // (Optional) Add more role-based redirects here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Require login for protected pages
    },
  }
);

// Only run middleware on specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
