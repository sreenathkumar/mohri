'use client'
import register from "@/actions/register"
import PasswordField from "@/app/(public)/login/components/PasswordField"
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn"
import DynamicAlert from "@/app/(public)/reset-password/components/DynamicAlert"
import { Input } from "@/components/shadcn/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import FormField from "@/components/ui/CustomField"
import { useActionState } from "react"

const initailState = {
    status: '',
    message: '',
    errors: {}
}


function AddEmployeeFrom() {
    const [state, formAction] = useActionState(register, initailState)
    return (
        <>
            {state && <DynamicAlert state={state} />}
            <form className="mt-8 space-y-6" action={formAction}>
                <FormField label="Name" htmlFor="name" error={state.errors?.name}>
                    <Input id="name" name="name" required />
                </FormField>
                <FormField label="Email" htmlFor="email" error={state.errors?.email}>
                    <Input id="email" name="email" type="email" required />
                </FormField>
                <FormField label="Password" htmlFor="password" error={state.errors?.password}>
                    <PasswordField />
                </FormField>
                <div className="mb-6">
                    <Select name="role" required>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-muted">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="clerk">Clerk</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <SubmitBtn text="Add Employee" loadingText="Adding Employee" />

            </form>
        </>
    )
}

export default AddEmployeeFrom