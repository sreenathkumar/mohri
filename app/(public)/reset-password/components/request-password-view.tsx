'use client'

import SubmitBtn from "@/app/(public)/login/components/SubmitBtn"
import { authClient } from "@/lib/auth-client"
import { Input } from "@/components/shadcn/input"
import { toast } from "sonner"


//take email and send OTP
function RequestPasswordReset() {

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        const { error } = await authClient.requestPasswordReset({
            email,
            redirectTo: '/reset-password'
        });

        if (!error) {
            toast.success('Password reset email sent successfully. Please check your inbox.');
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Reset Password</h2>
            <p className='text-sm text-muted-foreground mt-2'>
                Password reset successfully.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
                <Input className="bg-transparent border-border" type="email" name="email" placeholder="example@gmail.com" required />
                <SubmitBtn text="Send Confirmation Email" loadingText="Sending..." />
            </form>
        </div>
    )
}

export default RequestPasswordReset