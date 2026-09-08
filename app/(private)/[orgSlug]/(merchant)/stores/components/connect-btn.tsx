'use client'
import { Button } from "@/components/shadcn/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/shadcn/dialog";
import { useState } from 'react';
import ConnectStoreForm from "./connect-store-form";
import { Plus, Store } from "lucide-react";

function AddStoreBtn() {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-5 py-5 rounded-xl shadow-lg shadow-primary/15 transition-all duration-200 cursor-pointer flex items-center gap-2 text-sm self-start sm:self-auto">
                    <Plus className="h-4 w-4" />
                    Add Store
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-2xl bg-white/70 dark:bg-card/40 shadow-2xl overflow-hidden gap-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <div className="flex justify-center mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                        <Store className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <DialogHeader className="mb-8 relative z-10 text-center">
                    <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight text-center">
                        Connect Your Shop
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm text-center leading-relaxed">
                        Select your store platform and provide the base URL.
                    </DialogDescription>
                </DialogHeader>
                <ConnectStoreForm />
            </DialogContent>
        </Dialog>
    )
}

export default AddStoreBtn