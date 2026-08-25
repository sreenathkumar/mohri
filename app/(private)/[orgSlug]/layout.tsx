import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/auth-context';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function OrgLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}) {
    const { orgSlug } = await params;
    const reqHeaders = await headers();
    const session = await getServerSession();

    let org = null;
    try {
        org = await auth.api.getFullOrganization({
            headers: reqHeaders,
        });
    } catch (error) {
        console.error("Failed to fetch full organization details:", error);
    }

    const currentPath = reqHeaders.get('x-pathname') || `/${orgSlug}/dashboard`;

    if (!org) {
        console.log("No active organization found. Redirecting to onboarding.");
        redirect("/onboarding");
    }

    //First, correct slug mismatches (regardless of role)
    if (org.slug !== orgSlug) {
        const correctedPath = currentPath.replace(`/${orgSlug}`, `/${org.slug}`);
        redirect(correctedPath);
    }

    //Handle Driver Redirect (with Loop Prevention)
    const isDriver = session?.session.role === 'driver';
    const isAlreadyOnDriverRoute = currentPath.includes(`/${org.slug}/driver`);

    if (isDriver && !isAlreadyOnDriverRoute) {
        redirect(`/${org.slug}/driver/dashboard`);
    }

    //Prevent Non-Drivers from accessing Driver pages
    if (!isDriver && isAlreadyOnDriverRoute) {
        redirect(`/${org.slug}/dashboard`);
    }

    return <>{children}</>;
}