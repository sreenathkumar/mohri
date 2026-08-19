import { auth } from '@/lib/auth';
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
    const org = await auth.api.getFullOrganization({
        headers: await headers(),
    });
    if (!org) {
        console.log("No active organization found. Redirecting to onboarding.");
        redirect("/onboarding");
    }

    if (org.slug !== orgSlug) {
        console.log(`Organization slug mismatch. Expected: ${org.slug}, Received: ${orgSlug}. Redirecting to /${org.slug}/dashboard`);
        redirect(`/${org.slug}/dashboard`);
    }

    console.log(`User is accessing organization: ${org.slug}`);

    // slug is valid — render the actual page, don't redirect further
    return <>{children}</>;
}