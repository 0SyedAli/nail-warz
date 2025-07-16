// middleware.ts  (rename to .js if you are not using TypeScript)
import { NextResponse } from "next/server";

/* ----------- paths that never require auth ----------- */
const PUBLIC_PATHS = [
    /^\/$/,                 // home page
    /^\/auth(\/.*)?$/,      // /auth and everything under it
    /^\/api\/public(\/.*)?$/, // example of public API route
    /\.(.*)$|^\/_next\/|^\/favicon\.ico/, // static & Next.js internals
];

/* ----------- main middleware ----------- */
export function middleware(req) {
    const { pathname } = req.nextUrl;

    // 1. Skip public paths
    const isPublic = PUBLIC_PATHS.some((re) => re.test(pathname));
    if (isPublic) return NextResponse.next();

    // 2. Check token cookie
    const token = req.cookies.get("token")?.value;
    if (!token || token === "undefined" || token === "null") {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("returnTo", req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    // 3. (optional) verify / decode token here
    // e.g. if token is JWT, you can verify signature or expiry.
    // For demo, we'll assume existence is enough.

    return NextResponse.next();
}

/* ----------- matcher config ----------- */
// Apply middleware to *all* routes so we can whitelist via PUBLIC_PATHS.
export const config = {
    matcher: "/:path*",
};
