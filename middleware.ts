import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

// Guest-only routes
const authRoutes = ["/login", "/register"];

// Platform entry / system routes exempt from general protection
const platformRoutes = ["/continue", "/email-verified"];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const session = await auth.api.getSession({
        headers: req.headers,
    })
    const searchParams = req.nextUrl.search;

    const callbackUrl = encodeURIComponent(`${path}${searchParams}`);
    const isAuthRoute = authRoutes.some((r) => path.startsWith(r));
    const isPlatformRoute = platformRoutes.some((r) => path.startsWith(r));

    //logged in
    if (session) {
        if (isAuthRoute) {
            return NextResponse.redirect(new URL("/continue", req.url));
        }

        return NextResponse.next();
    }

    //not logged in
    if (isPlatformRoute) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: "nodejs",
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};