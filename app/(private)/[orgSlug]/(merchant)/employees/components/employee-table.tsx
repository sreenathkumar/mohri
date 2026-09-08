'use client'

import { deleteEmployee } from "@/actions/employeeActions"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/shadcn/alert-dialog'
import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { useSession } from "@/lib/auth-client"
import { Trash } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import UpdateEmployee from "./update-employee"


type Props = {
    employees: { id: string, name: string, email: string, role: string, image?: string }[],
}

const roleColors: Record<string, string> = {
    admin: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20",
    clerk: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20",
    driver: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20",
    user: "bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border-violet-500/20"
}

export default function EmployeeTable({ employees }: Props) {
    const { data } = useSession();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDeleteEmployee = async (email: string) => {
        const res = await deleteEmployee(email);

        if (res?.status === 'success') {
            toast.success(res.message || "Employee deleted successfully");
        } else {
            toast.error(res.message || "Failed to delete employee");
        }
    }
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="border-b border-border">
                        <TableHead className="px-6 py-4 font-semibold text-foreground">Name</TableHead>
                        <TableHead className="px-6 py-4 font-semibold text-foreground">Email</TableHead>
                        <TableHead className="px-6 py-4 font-semibold text-foreground">Role</TableHead>
                        <TableHead className="px-6 py-4 font-semibold text-foreground text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length > 0 ? employees.map((employee) => (
                        <TableRow key={employee.id} className="border-b border-border/60 hover:bg-muted/10 transition-colors group">
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium">
                                <Link className="hover:underline" href={data?.session.userId === employee.id ? './profile' : `./employees/${employee.id}`}>{employee.name}</Link>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium">{employee.email}</TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium">
                                <Badge
                                    className={roleColors[employee.role] || 'bg-foreground text-background'}
                                >
                                    {employee.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium ">
                                <div className="flex justify-end gap-4">
                                    <UpdateEmployee data={employee} />
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
                                                    onClick={() => {
                                                        handleDeleteEmployee(employee.email)
                                                        setDeleteModalOpen(false)
                                                    }}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : <TableRow><TableCell colSpan={4} className="px-6 py-4 font-medium text-center">No employees found</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}

