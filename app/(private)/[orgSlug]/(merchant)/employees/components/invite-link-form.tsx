'use client'

import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import FormField from "@/components/ui/CustomField"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import { inviteEmployee } from "@/actions/employeeActions"
import { useTransition } from "react"
import { toast } from "sonner"

function InviteLinkForm() {
    const [isPending, startTransition] = useTransition();
    const handleInviteEmployee = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await inviteEmployee(formData);
            console.log('invite employee result: ', result);
            if (result.status === "error") {
                toast.error(result.message || "An error occurred while inviting employee.");
            } else {
                toast.success(result.message || "Invitation sent successfully.");
            }
        })
    }
    return (
        <form className="flex flex-col gap-6" onSubmit={handleInviteEmployee}>
            <FormField label="Employee email" htmlFor="invite-email">
                <Input
                    id="invite-email"
                    name="email"
                    type="email"
                    placeholder="jhondoe@gmail.com"
                    autoComplete='work email'
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
            </FormField>
            <Select name="role" required>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-muted">
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                </SelectContent>
            </Select>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/70 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer text-sm mt-4" disabled={isPending}>
                {isPending ? "Sending Invitation..." : 'Send Invitation Link'}
            </Button>
        </form>
    )
}

export default InviteLinkForm