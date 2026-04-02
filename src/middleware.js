import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  let user = null;
  try {
    user = JSON.parse(request.cookies.get('user')?.value || '{}');
  } catch (e) {
    user = {};
  }

  // Public Routes List
  const vendorPublicRoutes = ["/auth/login", "/auth/signup", "/auth/forgot", "/auth/reset"];
  const userPublicRoutes = ["/user-auth/login", "/user-auth/signup", "/user-auth/forgot", "/user-auth/reset"];
  const adminPublicRoutes = ["/admin/auth/login"];

  const isVendorPublic = vendorPublicRoutes.includes(pathname);
  const isUserPublic = userPublicRoutes.includes(pathname);
  const isAdminPublic = adminPublicRoutes.includes(pathname);
  const isPublicRoute = isVendorPublic || isUserPublic || isAdminPublic;

  // 1. Unauthenticated State
  if (!token || !role) {
    if (!isPublicRoute) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/auth/login", request.url));
      } else if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      } else if (pathname.startsWith("/user-auth")) {
        return NextResponse.redirect(new URL("/user-auth/login", request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Authenticated State -> Protected Route Access Control
  
  // Admin Protection
  if (pathname.startsWith("/admin") && role !== "admin") {
     return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  // Vendor Protection
  if ((pathname.startsWith("/dashboard") || (pathname.startsWith("/auth") && !isVendorPublic)) && role !== "vendor") {
     return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  // 3. Authenticated State -> Redirect away from public login pages
  if (isPublicRoute) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (role === "vendor") {
      if (user?.isUpdated === true) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/auth/bussinessprofile", request.url));
      }
    } else if (role === "user") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public folder images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
