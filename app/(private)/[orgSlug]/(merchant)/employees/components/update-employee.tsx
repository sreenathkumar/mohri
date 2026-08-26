'use client'

import { Button } from "@/components/shadcn/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog"
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import FormField from "@/components/ui/CustomField"
import { useRouter } from "next/navigation"
import DynamicAlert from "@/app/(public)/reset-password/components/DynamicAlert"
import { Input } from "@/components/shadcn/input"
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn"
import { updateEmployeeRole } from "@/actions/employeeActions"


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


export default function UpdateEmployee({ data }: { data: { id: string, name: string, email: string, role: string } }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [state, setState] = useState<formState>(initailState);


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const res = await updateEmployeeRole({ id: data.id, newRole: formData.get("role") as string });
        setState(res);

        if (res.status === 'success') {
            router.refresh();
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 transition-colors duration-300 cursor-pointer">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-2xl bg-white/70 dark:bg-card/40 shadow-2xl overflow-hidden gap-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <DialogHeader className="mb-8 relative z-10 text-center">
                    <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight text-center">Update Employee Information</DialogTitle>
                </DialogHeader>
                {state && <DynamicAlert state={state} />}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <FormField label="Name" htmlFor="name" error={state.errors?.name}>
                        <Input id="name" name="name" required defaultValue={data.name} className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                    </FormField>
                    <FormField label="Email" htmlFor="email" error={state.errors?.email}>
                        <Input id="email" name="email" type="email" required defaultValue={data.email} className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
                    </FormField>
                    <div className="mb-6">
                        <Select name="role" required defaultValue={data.role} >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-muted">
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <SubmitBtn text="Update Employee" loadingText="Updating Employee..." />
                </form>
            </DialogContent>
        </Dialog>
    )
}

