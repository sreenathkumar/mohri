'use client'

import { resetPassword } from "@/actions/auth/resetPassword";
import { Input } from "@/components/shadcn/input";
import FormField from "@/components/ui/CustomField";
import { useActionState, useEffect } from "react";
import DynamicAlert from "./DynamicAlert";
import { useResetPasswordCtx } from "@/context/ResetPasswordCtx";
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn";

interface Props {
    setStep: React.Dispatch<React.SetStateAction<string>>
}


const initailState = {
    status: '',
    message: '',
    errors: {},
}

function NewPasswordForm({ setStep }: Props) {
    const [state, formAction] = useActionState(resetPassword, initailState);
    const { email } = useResetPasswordCtx();

    useEffect(() => {
        if (state?.status === 'success') {
            setStep('done')
        }
    }, [state, setStep]);

    return (
        <>
            {state?.status === 'error' && <DynamicAlert state={state} />}
            <form className="mt-8 space-y-6" action={formAction}>
                <div>
                    <input type="hidden" name="email" value={email} />
                    <FormField label="Password" htmlFor="password" error={state?.errors?.password}>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1"
                        />
                    </FormField>
                    <FormField label="Confirm Password" htmlFor="confirmPassword" error={state?.errors?.confirmPassword}>
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
        </>
    )
}

export default NewPasswordForm