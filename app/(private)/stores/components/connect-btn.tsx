'use client'
import { Button } from "@/components/shadcn/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/shadcn/dialog";
import { useState } from 'react';
import AddStoreFormHeader from "./add-store-form-header";
import ConnectStoreForm from "./connect-store-form";
import { Plus } from "lucide-react";

function AddStoreBtn() {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4" />
                    Add Store
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="sr-only hidden">Connect Your Shop</DialogTitle>
                    <AddStoreFormHeader />
                </DialogHeader>
                <ConnectStoreForm />
            </DialogContent>
        </Dialog>
    )
}

export default AddStoreBtn