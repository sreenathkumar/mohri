'use client'

import { deleteEmployees } from "@/actions/employee";
import { Button } from "@/components/shadcn/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    children: React.ReactNode;
    selectedItems: string[];
    setSelectedItems: (items: string[]) => void;
}

function DeleteEmployee({ children, selectedItems, setSelectedItems }: Props) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const router = useRouter()

    //handle delete employee
    const handleDeleteEmployee = async () => {
        setStatus('loading');
        const res = await deleteEmployees(selectedItems);

        if (res?.status === 'success') {
            setStatus('success');
            setSelectedItems([]);
            router.refresh();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">{`Are you sure you want to delete these ${selectedItems.length === 1 ? 'employee' : 'employees'}?`}</DialogTitle>
                </DialogHeader>
                <Button onClick={handleDeleteEmployee} disabled={status === 'loading'} className="bg-red-600 text-white">{status === 'loading' ? 'Deleting...' : 'Delete'}</Button>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteEmployee