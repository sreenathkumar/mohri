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

function AddStoreBtn() {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    Add Employee
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