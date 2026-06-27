'use client'

import { sendOTP } from "@/actions/auth/resetPassword"
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn"
import { useActionState, useEffect } from "react"
import DynamicAlert from "./DynamicAlert"
import EmailInputField from "./EmailInputField"

interface Props {
    setStep: React.Dispatch<React.SetStateAction<string>>
}


const initailState = {
    status: '',
    message: '',
    errors: {},
}

//take email and send OTP
function SendOTPForm({ setStep }: Props) {
    const [state, formAction] = useActionState(sendOTP, initailState);

    // if (state?.status === 'success') {
    //     setStep('otp')
    // }

    useEffect(() => {
        if (state?.status === 'success') {
            setStep('otp')
        }
    }, [state, setStep])

    return (
        <>
            {state?.status === 'error' && <DynamicAlert state={state} />}
            <form className="mt-8 space-y-6" action={formAction}>
                <div>
                    <EmailInputField error={state?.errors?.email} />
                </div>
                <SubmitBtn text="Send Confirmation Email" loadingText="Sending..." />
            </form>
        </>
    )
}

export default SendOTPForm