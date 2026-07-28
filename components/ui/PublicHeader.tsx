'use client';

import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../shadcn/button';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';

function PublicHeader() {
    const { data } = useSession();
    console.log('PublicHeader session:', data?.session);
    const isLoggedIn = !!data?.session
    const dashboardLink = data?.session?.role === 'driver' ? '/driver/dashboard' : '/merchant/dashboard';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 max-w-(--breakpoint-2xl) items-center justify-between px-4 mx-auto">
                <Link href='/' className="flex items-center gap-8">
                    <Image
                        width={240}
                        height={56}
                        src="/logo-light.svg"
                        alt="Company Logo"
                        priority
                        className="dark:hidden object-contain"
                    />

                    <Image
                        width={240}
                        height={56}
                        src="/logo-dark.svg"
                        alt="Company Logo"
                        priority
                        className="hidden dark:block object-contain"
                    />
                </Link>

                <div className="flex items-center gap-3">

                    <Link
                        href="/#how-it-works"
                        className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        How it works
                    </Link>
                    <Link
                        href="/pricing"
                        className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/contact"
                        className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>

                    {isLoggedIn ? (
                        <Button size="sm" variant='outline' className="gap-2 rounded-full">
                            <Link href={dashboardLink} className="flex items-center gap-2">
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Link href="/login" className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}


export default PublicHeader