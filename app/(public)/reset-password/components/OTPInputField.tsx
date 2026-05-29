'use client'

import { Input } from "@/components/shadcn/input"
import FormField from "@/components/ui/CustomField"

function OTPInputField({ error }: { error: string[] | undefined }) {
    return (
        <FormField label="Enter the OTP" htmlFor="otp" error={error}>
            <Input
                id="otp"
                name="otp"
                type="text"
                required
                className="mt-1"
            />
        </FormField>
    )
}

export default OTPInputField