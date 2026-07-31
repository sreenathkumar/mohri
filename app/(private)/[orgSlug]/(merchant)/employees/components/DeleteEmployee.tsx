'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/shadcn/alert-dialog'
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    children: React.ReactNode;
    selectedItems: string[];
    setSelectedItems: (items: string[]) => void;
}

function DeleteEmployee({ children, selectedItems, setSelectedItems }: Props) {
    const [open, setOpen] = useState(false);
    const router = useRouter()

    //handle delete employee
    const handleDeleteEmployee = async () => {
        // const res = await deleteEmployees(selectedItems);

        // if (res?.status === 'success') {
        //     setSelectedItems([]);
        //     router.refresh();
        // }
        console.log("Deleting employees with IDs:", selectedItems);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the employee and remove its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            handleDeleteEmployee()
                            setOpen(false)
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteEmployee