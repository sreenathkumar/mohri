'use client'

import { sendOTP, verifyOTP } from "@/actions/resetPassword";
import { useResetPasswordCtx } from "@/context/ResetPasswordCtx";
import { useActionState, useEffect, useState } from "react";
import DynamicAlert from "./DynamicAlert";
import OTPInputField from "./OTPInputField";
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn";

interface Props {
    setStep: React.Dispatch<React.SetStateAction<string>>
}


const initailState = {
    status: '',
    message: '',
    errors: {},
}

function VerifyOTPForm({ setStep }: Props) {
    const [state, formAction] = useActionState(verifyOTP, initailState);
    const { email } = useResetPasswordCtx();
    const [resendStatus, setResendStatus] = useState({ status: '', message: '' });

    console.log('resendStatus: ', resendStatus);


    //function to resend the otp email
    const resendOTP = async () => {
        const formData = new FormData();
        formData.append('email', email as string);

        const res = await sendOTP(initailState, formData);

        console.log('res: ', res);

        if (res?.status === 'success') {
            setResendStatus({ status: 'success', message: res?.message || 'success' });
        } else {
            setResendStatus({ status: 'error', message: res?.message || 'error' });
        }
    }

    useEffect(() => {
        if (state?.status === 'success') {
            setStep('password')
        }
    }, [state, setStep])

    return (
        <>
            {state?.status === 'error' && <DynamicAlert state={state} />}
            {(resendStatus?.status === 'error' || resendStatus?.status === 'success') && <DynamicAlert state={resendStatus} />}
            <form className="mt-8 space-y-6" action={formAction}>
                <div>
                    <input type="hidden" name="email" value={email} />
                    <OTPInputField error={state?.errors?.otp} />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Didn&#39;t receive code?</span>
                    <span onClick={resendOTP} className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Resend Code</span>
                </div>
                <SubmitBtn text="Verify" loadingText="Verifying..." />
            </form>
        </>
    )
}

export default VerifyOTPForm