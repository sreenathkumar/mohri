'use client'

import { useState } from "react";
import NewPasswordForm from "./NewPasswordForm";
import SendOTPForm from "./SendOTPForm";
import VerifyOTPForm from "./VerifyOTPForm";
import Link from "next/link";
import { ResetPasswordProvider } from "@/context/ResetPasswordCtx";


function ResetPasswordForm() {
  const [step, setStep] = useState('email');

  return (
    <ResetPasswordProvider>
      <div>
        <h2 className="text-2xl font-semibold leading-none tracking-tight">Reset Password</h2>
        <p className='text-sm text-muted-foreground'>
          {
            step === 'email' && 'Enter your email to reset your password'
          }
          {
            step === 'otp' && 'Enter the OTP sent to your email to reset your password'
          }
          {
            step === 'password' && 'Enter your new password'
          }
          {
            step === 'done' && 'Password reset successfully.'
          }
        </p>
      </div>
      {
        step === 'email' && <SendOTPForm setStep={setStep} />
      }
      {
        step === 'otp' && <VerifyOTPForm setStep={setStep} />
      }
      {
        step === 'password' && <NewPasswordForm setStep={setStep} />
      }
      {
        step === 'done' && <h3 className="text-base text-center p-4 border text-green-500 border-green-500 rounded">Password reset successfully. Please <Link href="/login" className="text-blue-500">login</Link> with your new password.</h3>
      }
    </ResetPasswordProvider>
  )
}

export default ResetPasswordForm