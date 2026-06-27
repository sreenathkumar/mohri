'use client'

import { Button } from "@/components/shadcn/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog"
import { useState } from 'react'
import AddEmployeeFrom from "./AddEmployeeForm"


export default function AddEmployee() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    Add Employee
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="font-bold text-2xl">Add Employee</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Please use gmail, yahoo, or outlook email to add an employee.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full min-w-0 overflow-hidden">
                    <AddEmployeeFrom />
                </div>
            </DialogContent>
        </Dialog>
    )
}

