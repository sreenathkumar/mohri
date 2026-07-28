import { getOrgSlug, getServerSession } from '@/lib/auth';
import BottomNav from './components/BottomNav';
import DriverDashHeader from './components/Header';
import { redirect } from 'next/navigation';


async function DriverDashLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    const orgSlug = await getOrgSlug(session?.session.userId as string);
    const userRole = session?.session.role;

    //if not a driver, redirect to continue and that will send to the right page
    if (userRole !== 'driver') {
        if (orgSlug) {
            redirect(`/${orgSlug}/dashboard`);
        } else {
            redirect('/continue');
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <DriverDashHeader />
            {children}
            <BottomNav />
        </div>
    )
}

export default DriverDashLayout