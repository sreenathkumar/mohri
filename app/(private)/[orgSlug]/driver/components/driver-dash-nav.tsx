'use client';

import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession()

    const navItems = [
        { id: 'dashboard', label: 'Tasks', icon: '📋', url: `/${session?.session?.activeOrganizationSlug}/driver/dashboard` },
        { id: 'profile', label: 'Profile', icon: '👤', url: `/${session?.session?.activeOrganizationSlug}/driver/profile` },
    ];

    return (
        <nav className="fixed bottom-[16] left-0 right-0 bg-muted backdrop-blur-md border-t border-border/40 max-w-[95%] mx-auto rounded-full lg:max-w-xl ">
            <div className="flex items-center justify-around max-w-full px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.url}
                        className={`flex-1 py-3 px-2 flex flex-col items-center gap-1.5 text-xs font-medium transition-all duration-200 relative ${pathname.includes(item.id)
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                        {pathname.includes(item.id) && (
                            <div className="absolute top-1 right-1 left-1 h-0.5 bg-linear-to-r from-primary/0 via-primary to-primary/0 rounded-full"></div>
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
