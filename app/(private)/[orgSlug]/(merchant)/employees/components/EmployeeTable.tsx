'use client'

import { Badge } from "@/components/shadcn/badge"
import { Checkbox } from "@/components/shadcn/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import UpdateEmployee from "./UpdateEmployee"
import DeleteEmployee from "./DeleteEmployee"
import { Button } from "@/components/shadcn/button"
import { Trash } from "lucide-react"
import Link from "next/link"


type Props = {
    employees: { id: string, name: string, email: string, role: string, image?: string }[],
    selectedItems: string[],
    setSelectedItems: (items: string[]) => void
}

const roleColors: Record<string, string> = {
    admin: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20",
    clerk: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20",
    driver: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20",
    user: "bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border-violet-500/20"
}

export default function EmployeeTable({ employees, selectedItems, setSelectedItems }: Props) {

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="border-b border-border">
                        <TableHead className="px-6 py-4 font-semibold text-foreground">
                            <Checkbox
                                checked={selectedItems.length === employees.length}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedItems(employees.map(t => t.id))
                                    } else {
                                        setSelectedItems([])
                                    }
                                }}
                                className='border-muted-foreground/30'
                            />
                        </TableHead>
                        <TableHead className="px-6 py-4 font-semibold text-foreground">Name</TableHead>
                        <TableHead className="px-6 py-4 font-semibold text-foreground">Email</TableHead>
                        <TableHead className="px-6 py-4 font-semibold text-foreground">Role</TableHead>
                        <TableHead className="px-6 py-4 font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length > 0 ? employees.map((employee) => (
                        <TableRow key={employee.id} className="border-b border-border/60 hover:bg-muted/10 transition-colors group">
                            <TableCell className="px-6 py-4 font-medium">
                                <Checkbox
                                    checked={selectedItems.includes(employee.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedItems([...selectedItems, employee.id])
                                        } else {
                                            setSelectedItems(selectedItems.filter(id => id !== employee.id))
                                        }
                                    }}
                                    className='border-muted-foreground/30'
                                />
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium">
                                <Link className="hover:underline" href={`/merchant/employees/${employee.id}`}>{employee.name}</Link>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium">{employee.email}</TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium">
                                <Badge
                                    className={roleColors[employee.role] || 'bg-foreground text-background'}
                                >
                                    {employee.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground font-medium">
                                <div className="flex justify-end gap-4">
                                    <UpdateEmployee data={employee} />
                                    <DeleteEmployee selectedItems={[employee.id]} setSelectedItems={setSelectedItems}>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                            <Trash />
                                        </Button>
                                    </DeleteEmployee>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : <TableRow><TableCell colSpan={5} className="px-6 py-4 font-medium text-center">No employees found</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}

