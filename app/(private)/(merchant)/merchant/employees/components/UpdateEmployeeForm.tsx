'use client'

import { updateEmployee } from "@/actions/employee"
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
import { useRouter } from "next/navigation"
import { useState } from "react"

interface formState {
    status: string,
    message: string,
    errors?: {
        name?: string[],
        email?: string[],
        role?: string[],
    }
}

const initailState = {
    status: '',
    message: '',
    errors: {

    }
}


function UpdateEmployeeForm({ data }: { data: { id: string, name: string, email: string, role: string } }) {
    const router = useRouter();
    const [state, setState] = useState<formState>(initailState);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const res = await updateEmployee(data.id, formData);
        setState(res);


        if (res.status === 'success') {
            router.refresh();
        }
    }

    console.log('edit data: ', data);


    return (
        <>
            {state && <DynamicAlert state={state} />}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <FormField label="Name" htmlFor="name" error={state.errors?.name}>
                    <Input id="name" name="name" required defaultValue={data.name} />
                </FormField>
                <FormField label="Email" htmlFor="email" error={state.errors?.email}>
                    <Input id="email" name="email" type="email" required defaultValue={data.email} />
                </FormField>
                <div className="mb-6">
                    <Select name="role" required defaultValue={data.role} >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-muted">
                            <SelectItem value="admin"  >Admin</SelectItem>
                            <SelectItem value="clerk">Clerk</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <SubmitBtn text="Update Employee" loadingText="Updating Employee..." />

            </form>
        </>
    )
}

export default UpdateEmployeeForm