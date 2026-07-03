
import { SessionProvider } from 'next-auth/react';

async function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default DashboardLayout