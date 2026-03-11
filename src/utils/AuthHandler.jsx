"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

export default function AuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");
    const role = Cookies.get("role");

    // Define public routes for each flow
    const vendorPublicRoutes = ["/auth/login", "/auth/signup", "/auth/forgot", "/auth/reset"];
    const userPublicRoutes = ["/user-auth/login", "/user-auth/signup", "/user-auth/forgot", "/user-auth/reset"];
    const adminPublicRoutes = ["/admin/auth/login"];

    const isVendorPublic = vendorPublicRoutes.includes(pathname);
    const isUserPublic = userPublicRoutes.includes(pathname);
    const isAdminPublic = adminPublicRoutes.includes(pathname);
    const isPublicRoute = isVendorPublic || isUserPublic || isAdminPublic;

    // 1. No token or no role -> redirect to respective login if on protected route
    if (!token || !role) {
      if (!isPublicRoute) {
        if (pathname.startsWith("/admin")) {
          router.replace("/admin/auth/login");
        } else if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) {
          router.replace("/auth/login");
        } else if (pathname.startsWith("/user-auth")) {
          router.replace("/user-auth/login");
        }
      }
      return;
    }

    // 2. Role exists -> Check if on "wrong" dashboard or wrong login
    try {
      const parsedUser = JSON.parse(userData || "{}");

      // Admin Protection
      if (pathname.startsWith("/admin") && role !== "admin") {
        router.replace("/admin/auth/login");
        return;
      }

      // Vendor Protection
      if ((pathname.startsWith("/dashboard") || (pathname.startsWith("/auth") && !isVendorPublic)) && role !== "vendor") {
        router.replace("/auth/login");
        return;
      }

      // 3. Already logged in -> Redirect away from login pages to proper dashboard
      if (isPublicRoute) {
        if (role === "admin") {
          router.replace("/admin/dashboard");
        } else if (role === "vendor") {
          if (parsedUser?.isUpdated === true) {
            router.replace("/dashboard");
          } else {
            router.replace("/auth/bussinessprofile");
          }
        } else if (role === "user") {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("role");

      if (!isPublicRoute) {
        if (role === "admin" && !pathname.startsWith("/admin")) {
          router.replace("/admin/dashboard");
        } else if (role === "vendor" && !pathname.startsWith("/dashboard")) {
          router.replace("/dashboard");
        } else if (role === "user" && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
          router.replace("/");
        }
      }
    }
  }, [pathname]);

  return null;
}
