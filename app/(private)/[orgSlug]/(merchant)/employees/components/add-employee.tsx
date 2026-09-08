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
import DirectRegisterForm from "./direct-register-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import InviteLinkForm from "./invite-link-form"


export default function AddEmployee() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-5 py-5 rounded-xl shadow-lg shadow-primary/15 transition-all duration-200 cursor-pointer flex items-center gap-2 text-sm self-start sm:self-auto">
                    Add Employee
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-2xl bg-white/70 dark:bg-card/40 shadow-2xl overflow-hidden gap-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <DialogHeader className="mb-8 relative z-10 text-center">
                    <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight text-center">Add Employee</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm text-center leading-relaxed">
                        Please use gmail, yahoo, or outlook email to add an employee.
                    </DialogDescription>
                </DialogHeader>
                <Tabs className='w-full' defaultValue="direct">
                    <TabsList className='w-full bg-muted/20'>
                        <TabsTrigger value="direct" className='w-full text-center dark:data-[state=active]:bg-muted/70 '>
                            Direct Register
                        </TabsTrigger>
                        <TabsTrigger value="link" className='w-full text-center dark:data-[state=active]:bg-muted/70'>
                            Invite Link
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="direct" className='w-full p-4'>
                        <DirectRegisterForm />
                    </TabsContent>
                    <TabsContent value="link" className='w-full p-4'>
                        <InviteLinkForm />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

