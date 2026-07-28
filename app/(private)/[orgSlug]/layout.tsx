import { auth, getServerSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrgLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}) {
    const session = await getServerSession();
    const { orgSlug } = await params;

    if (!session) redirect('/login');
    if (!session.user.emailVerified) redirect('/verify-email');

    const org = await auth.api.getFullOrganization({
        headers: await headers(),
    });
    if (!org) redirect('/onboarding');

    if (org.slug !== orgSlug) {
        redirect(`/${org.slug}/dashboard`);
    }

    // slug is valid — render the actual page, don't redirect further
    return <>{children}</>;
}