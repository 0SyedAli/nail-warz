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

    // Allow login and signup pages to be accessible without auth
    const publicRoutes = ["/auth/login", "/auth/signup"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token || !userData) {
      if (!isPublicRoute) {
        router.replace("/auth/login");
      }
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);

      // Redirect to proper route only if already on login/signup
      if (isPublicRoute) {
        if (parsedUser?.isUpdated === true) {
          router.replace("/dashboard");
        } else {
          router.replace("/auth/bussinessprofile");
        }
      }

    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      Cookies.remove("token");
      Cookies.remove("user");

      if (!isPublicRoute) {
        router.replace("/auth/login");
      }
    }
  }, [pathname]);

  return null;
}
