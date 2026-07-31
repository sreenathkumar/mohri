'use client'

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, } from "react";


function ConfirmUI({ date }: { date: string }) {
    const { data: session, update, status } = useSession();

    const redirectUrl = session?.user?.role === 'driver'
        ? '/driver/dashboard'
        : session?.user?.role === 'merchant'
            ? '/merchant/dashboard'
            : '/';

    const hasUpdated = useRef(false);

    useEffect(() => {
        console.log('Session in ConfimrUI:', session, date);
        if (date && status === 'authenticated' && !hasUpdated.current) {
            hasUpdated.current = true;

            // 2. Trigger NextAuth JWT session update
            update({
                user: {
                    emailVerified: date
                }
            });
        }

    }, [date, session, update, status]);

    return (
        <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
                Email Verified Successfully
            </h1>
            <p className="text-muted-foreground text-center mb-8">
                Your email has been verified successfully. You can now access your account.
            </p>
            <div className="text-center">
                <Link href={redirectUrl} className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default ConfirmUI