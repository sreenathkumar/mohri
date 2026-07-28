import { auth, getServerSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';


async function ContinuePage({
    searchParams,
}: {
    searchParams: Promise<{ callbackURL?: string }>;
}) {
    console.log('continue page triggered')
    const session = await getServerSession()
    //if any callbackURL is provided, redirect to that URL
    const { callbackURL } = await searchParams;


    // No session at all → back to login, preserve intended destination
    if (!session) {
        const loginUrl = callbackURL
            ? `/login?callbackURL=${encodeURIComponent(callbackURL)}`
            : '/login';
        redirect(loginUrl);
    }

    // Email not verified yet
    if (!session.user.emailVerified) {
        redirect('/email-verified?error="NOT_VERIFIED"');
    }

    //if the userRole is user, redirect to the home page
    if (session.session.role === 'user') {
        redirect('/');
    }

    const org = await auth.api.getFullOrganization({
        headers: await headers()
    });

    if (!org) {
        redirect('/noboarding');
    }

    // Respect an explicit deep link if present and it's within the user's own org
    if (callbackURL && callbackURL.startsWith(`/${org?.slug}`)) {
        redirect(callbackURL);
    }

    // Default destination by role
    if (session.session.role === 'driver') {
        redirect(`/${org.slug}/driver/dashboard`);
    }

    redirect(`/${org.slug}/dashboard`);

}


export default ContinuePage;