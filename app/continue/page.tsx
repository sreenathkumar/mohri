import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/auth-context";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ContinuePage({
    searchParams,
}: {
    searchParams: Promise<{ callbackURL?: string }>;
}) {
    const session = await getServerSession();
    const { callbackURL } = await searchParams;

    // Double check authentication status
    if (!session) {
        redirect("/login");
    }

    // Email Verification Check
    if (!session.user.emailVerified) {
        console.log("[Continue] User email unverified. Redirecting to /verify-email.");
        redirect("/verify-email?error=NOT_VERIFIED");
    }

    const reqHeaders = await headers();

    // Fetch Active Organization details
    const org = await auth.api.getFullOrganization({
        headers: reqHeaders,
    });

    // No Active Org? -> Send directly to onboarding (no fallback org setting)
    if (!org) {
        console.log("[Continue] No active org found on session. Redirecting to /onboarding.");
        redirect("/onboarding");
    }

    // Deep Link Callback Check (Safe inside active org)
    if (callbackURL && callbackURL.startsWith(`/${org.slug}`)) {
        console.log(`[Continue] Redirecting to callback URL: ${callbackURL}`);
        redirect(callbackURL);
    }

    // Inspect user's role in THIS active organization
    const currentMember = org.members?.find((m) => m.userId === session.user.id);
    const orgRole = currentMember?.role;

    // Dispatch based on Role
    if (orgRole === "driver") {
        console.log(`[Continue] Driver detected. Redirecting to /${org.slug}/driver/dashboard`);
        redirect(`/${org.slug}/driver/dashboard`);
    }

    // Default redirect for Owners, Admins, and Staff
    console.log(`[Continue] Merchant/Staff detected. Redirecting to /${org.slug}/dashboard- +`);
    redirect(`/${org.slug}/dashboard`);
}