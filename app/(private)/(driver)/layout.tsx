import BottomNav from './components/BottomNav'
import DriverDashHeader from './components/Header'
import { redirect } from 'next/navigation';
import { getServerSessionContext } from '@/lib/checkServerAuth';

export const dynamic = 'force-dynamic';

async function DriverDashLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSessionContext();

    if (session) {
        if (session.role !== 'driver') {
            redirect('/merchant/dashboard');
        }
    } else {
        redirect('/login');
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