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
import UpdateEmployeeForm from "./UpdateEmployeeForm"



export default function UpdateEmployee({ data }: { data: { id: string, name: string, email: string, role: string } }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 transition-colors duration-300">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-2xl bg-white/70 dark:bg-card/40 shadow-2xl overflow-hidden gap-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <DialogHeader className="mb-8 relative z-10 text-center">
                    <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight text-center">Update Employee Information</DialogTitle>
                </DialogHeader>
                <UpdateEmployeeForm data={data} />
            </DialogContent>
        </Dialog>
    )
}

