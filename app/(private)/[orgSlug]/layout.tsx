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
    const session = await getServerSession();
    const { orgSlug } = await params;

    if (!session) {
        console.log("No active session found in org slug layout. Redirecting to login.");
        redirect('/login')
    };
    if (!session.user.emailVerified) {
        console.log("User email not verified. Redirecting to /email-verified.");
        redirect('/email-verified?error=NOT_VERIFIED');
    }

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