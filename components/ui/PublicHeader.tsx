'use client';

import { User as UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../shadcn/button';
import Image from 'next/image';

function PublicHeader() {
    const { data: session } = useSession();

    const isLoggedIn = !!session?.user;
    const userRole = session?.user?.role;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 max-w-(--breakpoint-2xl) items-center justify-between px-4 mx-auto">

                <div className="flex items-center gap-8">
                    <Image
                        src="/logo-dark.svg"
                        alt="Company Logo"
                        width={240}
                        height={56}
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/about"
                        className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>

                    {isLoggedIn && userRole ? (
                        <Button size="sm" className="gap-2 rounded-full">
                            <Link href={userRole === 'driver' ? '/driver/dashboard' : '/merchant/dashboard'} className="flex items-center gap-2">
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