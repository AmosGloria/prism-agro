import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES: Record<string, string> = {
  "/buyer": "buyer",
  "/farmer": "farmer",
  "/logistics": "logistics",
  "/admin": "admin",
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiredRole = Object.entries(PROTECTED_ROUTES).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )?.[1];

  if (!requiredRole) return NextResponse.next();

  const token = request.cookies.get("fp_token")?.value;
  const userRole = request.cookies.get("fp_role")?.value;

  if (!token && !userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userRole && userRole !== requiredRole) {
    const HOME: Record<string, string> = {
      buyer: "/buyer/marketplace",
      farmer: "/farmer",
      logistics: "/logistics/loads",
      admin: "/admin/disputes",
    };

    return NextResponse.redirect(
      new URL(HOME[userRole] ?? "/login", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/buyer/:path*",
    "/farmer/:path*",
    "/logistics/:path*",
    "/admin/:path*",
  ],
};
