// middleware.ts
import { NextResponse } from "next/server"

/* List of public paths that don't require auth */
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/api/public"]

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // 1. Allow access to public paths
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path))
  if (isPublic) {
    return NextResponse.next()
  }

  // 2. Check token
  const token = request.cookies.get("token")?.value
  if (!token || token === "undefined" || token === "null") {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Verify token (replace with real logic in production)
  const isValid = await verifyToken(token)
  if (!isValid) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  // 4. Check profile creation status from user cookie
  const userCookie = request.cookies.get("user")?.value

  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie))

      // Case: user is not updated, but trying to access other pages → redirect to /auth/bussinessprofile
      if (user?.isUpdated === false && pathname !== "/auth/bussinessprofile") {
        return NextResponse.redirect(new URL("/auth/bussinessprofile", request.url))
      }

      // Case: user is already updated but accessing onboarding → redirect to dashboard
      if (user?.isUpdated === true && pathname === "/auth/bussinessprofile") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

    } catch (error) {
      console.error("Failed to parse user cookie:", error)
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("user")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard",
    "/auth/addyourtechnician",
    "/auth/bussinessprofile",
    "/auth/uploadservice",
    "/auth/:path*",
    "/api/:path*",
  ],
}

/* Dummy token verification logic */
async function verifyToken(token) {
  try {
    // Replace this with real JWT verification
    return token === "valid-token" // TEMP: demo only
  } catch (err) {
    console.error("Token verification failed:", err)
    return false
  }
}
