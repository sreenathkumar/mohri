'use client'
import { addEmployee, checkEmployeeEmail, inviteEmployee } from "@/actions/employee"
import PasswordField from "@/app/(public)/login/components/PasswordField"
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn"
import DynamicAlert from "@/app/(public)/reset-password/components/DynamicAlert"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import { ClipboardCopy } from "@/components/ui/ClipBoardCopy"
import FormField from "@/components/ui/CustomField"
import { useActionState, useRef, useState, useTransition } from "react"

const initailState = {
    status: '',
    message: '',
    errors: {}
}

type EmailStatusType = 'idle' | 'checking' | 'exists' | 'new';


function AddEmployeeFrom() {
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState<EmailStatusType>('idle');
    const [checkingEmail, startTransition] = useTransition()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [addEmployeeState, addEmployeeAction] = useActionState(addEmployee, initailState);
    const [inviteEmployeeState, inviteEmployeeAction] = useActionState(inviteEmployee, initailState);

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setEmail(value)
        setEmailStatus('idle')

        if (debounceRef.current) clearTimeout(debounceRef.current)

        const emailRegex = /^[^\s@]+@(?:gmail|yahoo|outlook)\.com$/i;

        if (!emailRegex.test(value)) {
            return;
        }

        debounceRef.current = setTimeout(() => {
            startTransition(async () => {
                setEmailStatus('checking')
                const status = await checkEmployeeEmail(value);

                if (status.exists) {
                    setEmailStatus('exists');
                } else {
                    setEmailStatus('new');
                }
            })
        }, 600)

    }


    return (
        <div className="flex flex-col gap-6">
            {(addEmployeeState || inviteEmployeeState) && <DynamicAlert state={addEmployeeState || inviteEmployeeState} />}
            <FormField label="Employee email" htmlFor="init-email" error={addEmployeeState.errors?.email}>
                <Input
                    name="init-email"
                    type="email"
                    placeholder="jhondoe@gmail.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
            </FormField>

            {checkingEmail && <p className="text-sm text-muted-foreground">Checking email...</p>}
            {emailStatus === 'exists' && <form action={inviteEmployeeAction}>
                <Input type="hidden" name="email" value={email} />
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
                {
                    inviteEmployeeState.status === 'success' &&
                    <div className="flex flex-col gap-2">
                        <p className="text-success text-xs">{inviteEmployeeState.message}</p>
                        <ClipboardCopy content={inviteEmployeeState.link as string} className="mb-4">{inviteEmployeeState.link}</ClipboardCopy>

                    </div>
                }
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer text-sm relative z-10" disabled={inviteEmployeeState.status === 'success'}>
                    Invite
                </Button>
            </form>}
            {emailStatus === 'new' && <form action={addEmployeeAction} className="flex flex-col gap-6">
                <Input type="hidden" name="email" value={email} />
                <FormField label="Name" htmlFor="name" error={addEmployeeState.errors?.name}>
                    <Input id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                </FormField>
                <FormField label="Password" htmlFor="password" error={addEmployeeState.errors?.password}>
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

            </form>}
        </div>
    )
}

export default AddEmployeeFrom