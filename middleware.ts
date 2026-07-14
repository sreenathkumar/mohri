import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";

//pulic routes
const privateRoutes = ["/driver", "/merchant"];

//auth object without the mongodb adapter
const { auth } = NextAuth(authConfig);

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const searchParams = req.nextUrl.search;

    const session = await auth();

    if (!session && privateRoutes.some((route) => path.startsWith(route))) {
        const callbackUrl = encodeURIComponent(`${path}${searchParams}`);

        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};