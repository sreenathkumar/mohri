import { getServerSession } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import BottomNav from './components/driver-dash-nav';
import DriverDashHeader from './components/driver-dash-header';


async function DriverDashLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    const userRole = session?.session.role;
    const orgSlug = session?.session.activeOrganizationSlug;

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