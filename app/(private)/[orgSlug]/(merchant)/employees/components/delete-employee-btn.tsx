'use client'

import { deleteEmployee } from "@/actions/employeeActions"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/shadcn/alert-dialog'
import { Button } from "@/components/shadcn/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function DeleteEmployeeBtn({ email }: { email: string }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDeleteEmployee = async () => {
        const res = await deleteEmployee(email);

        if (res?.status === 'success') {
            toast.success(res.message || "Employee deleted successfully");
        } else {
            toast.error(res.message || "Failed to delete employee");
        }
    }
    return (
        <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                    <Trash />
                </Button>
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
                        onClick={handleDeleteEmployee}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteEmployeeBtn