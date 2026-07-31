'use client'

import { Button } from "@/components/shadcn/button";
import { authClient, useSession } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResendBtn() {
    const searchParams = useSearchParams()
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState('');
    const { data: session } = useSession()

    const handleResendLink = async () => {
        if (!session?.user.email) {
            setError('Email address is missing.')
            return
        }

        setError('')

        try {
            const { error } = await authClient.sendVerificationEmail({
                email: session?.user.email
            });

            if (error) {
                setError(error.message || 'An error occurred while resending the verification link. Please try again.');
                return;
            }

            toast.success('Verification link resent successfully. Please check your email.');
            setResendTimer(60);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'An error occurred while resending the verification link. Please try again.')
        }
    }


    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendTimer]);

    return (
        <div className="flex flex-col items-center">
            <Button
                onClick={handleResendLink}
                variant="outline"
                className="w-full cursor-pointer"
                disabled={resendTimer > 0}
            >
                {resendTimer > 0 ? (
                    `Resend in ${resendTimer}s`
                ) : (
                    'Resend Link'
                )}
            </Button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

    )
}
