import { getCookieCache } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

//private routes
const privateRoutes = ["/driver", "/merchant", "/dashboard"];
//auth routes
const authRoutes = ["/login", "/register", "/email-verified"];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const searchParams = req.nextUrl.search;

    const session = await getCookieCache(req);

    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
    const isPrivateRoute = privateRoutes.some((route) => path.startsWith(route));
    const isEmailVerified = session?.user?.emailVerified;

    // user role and primary dashboard path
    const role = session?.session?.role;
    const userDashboard = role === "driver" ? "/driver/dashboard" : "/merchant/dashboard";

    //user is authenticated, check if they are trying to access auth routes (login/register)
    if (isAuthRoute) {
        if (session) {
            //redirect to their primary dashboard if they are already logged in
            if (isEmailVerified) {
                return NextResponse.redirect(new URL(`${userDashboard}`, req.url));
            }

            if (path === "/email-verified" && !isEmailVerified) {
                return NextResponse.next();
            }

            return NextResponse.redirect(new URL(`/email-verified?error=NOT_VERIFIED`, req.url));
        } else if (path === "/email-verified") {
            //unauthenticated user trying to access email-verified page -> redirect to login
            return NextResponse.redirect(new URL(`/login`, req.url));
        }

        return NextResponse.next();
    }


    if (isPrivateRoute) {
        // Unauthenticated user attempting to access protected route -> redirect to login
        if (!session) {
            const callbackUrl = encodeURIComponent(`${path}${searchParams}`);
            return NextResponse.redirect(
                new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
            );
        }

        // authenticated but email not verified -> redirect to email-verified page
        if (!isEmailVerified) return NextResponse.redirect(new URL(`/email-verified?error=NOT_VERIFIED`, req.url));

        if (path.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL(userDashboard, req.url));
        }

        // Lock user into their assigned role routes
        if (path.startsWith("/merchant") && role === "driver") {
            return NextResponse.redirect(new URL(userDashboard, req.url));
        }

        if (path.startsWith("/driver") && role !== "driver") {
            return NextResponse.redirect(new URL(userDashboard, req.url));
        }
    }


    return NextResponse.next();
}

export const config = {
    runtime: "nodejs",
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};