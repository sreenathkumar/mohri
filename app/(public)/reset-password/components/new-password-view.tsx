'use client'

import { resetPassword } from "@/actions/authActions";
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn";
import { Input } from "@/components/shadcn/input";
import FormField from "@/components/ui/CustomField";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";


function NewPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter()
    const token = searchParams.get('token');

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await resetPassword(formData);

        if (result.status === 'success') {
            toast.success('Password reset successfully.');
        } else {
            toast.error(result.message);
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Reset Password</h2>
            <p className='text-sm text-muted-foreground mt-2'>
                Password reset successfully.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
                <div>
                    {token && <input type="hidden" name="token" value={token} />}
                    <FormField label="Password" htmlFor="password" >
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1"
                        />
                    </FormField>
                    <FormField label="Confirm Password" htmlFor="confirmPassword">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            className="mt-1"
                        />
                    </FormField>
                </div>
                <SubmitBtn text="Reset Password" loadingText="Sending..." />
            </form>
        </div>
    )
}

export default NewPasswordForm