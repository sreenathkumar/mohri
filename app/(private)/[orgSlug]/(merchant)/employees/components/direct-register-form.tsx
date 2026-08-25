'use client'
import { addEmployee } from "@/actions/employeeActions"
import PasswordField from "@/app/(public)/login/components/PasswordField"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import FormField from "@/components/ui/CustomField"
import { useTransition } from "react"
import { toast } from "sonner"


function DirectRegisterForm() {
    const [isPending, startTransition] = useTransition();
    const handleAddEmployee = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await addEmployee(formData);

            if (result.status === "error") {
                console.log('Error adding employee: ', result.message, ' with errors: ', result.errors);
                const errors = Object.values(result.errors ?? {}).flat() as string[];
                toast.error(result.message, {
                    description: (
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                            {errors.map((msg: string, index: number) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    ),
                });
            } else {
                toast.success(result.message || "Employee registered successfully.");
            }
        })
    }

    return (
        <form onSubmit={handleAddEmployee} className="flex flex-col gap-6">
            <FormField label="Name" htmlFor="name">
                <Input id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="Jhone Doe" autoComplete="name" />
            </FormField>
            <FormField label="Email" htmlFor="email">
                <Input className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" name="email" placeholder="jhonedoe@company.com" autoComplete="work email" />
            </FormField>
            <FormField label="Password" htmlFor="password">
                <PasswordField />
            </FormField>
            <div className="mb-6">
                <Select name="role" required>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-muted">
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/70 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer text-sm mt-4" disabled={isPending}>
                {isPending ? "Registering..." : 'Register Employee'}
            </Button>
        </form>
    )
}

export default DirectRegisterForm