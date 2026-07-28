import BottomNav from './components/BottomNav';
import DriverDashHeader from './components/Header';

export const dynamic = 'force-dynamic';

async function DriverDashLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <DriverDashHeader />
            {children}
            <BottomNav />
        </div>
    )
}

export default DriverDashLayout