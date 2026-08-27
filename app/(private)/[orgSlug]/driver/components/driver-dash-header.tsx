import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function DriverDashHeader() {
    return (
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
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
                </div>
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 px-3 py-1.5 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                    <span className="text-destructive">On Duty</span>
                </div>
            </div>
        </header>
    );
}

export default DriverDashHeader