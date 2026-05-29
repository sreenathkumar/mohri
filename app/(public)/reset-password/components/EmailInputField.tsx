import { Input } from "@/components/shadcn/input"
import FormField from "@/components/ui/CustomField"
import { useResetPasswordCtx } from "@/context/ResetPasswordCtx"

function EmailInputField({ error }: { error: string[] | undefined }) {
    const { setEmail } = useResetPasswordCtx()

    return (
        <FormField label="Email Address" htmlFor="email" error={error}>
            <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormField>
    )
}

export default EmailInputField