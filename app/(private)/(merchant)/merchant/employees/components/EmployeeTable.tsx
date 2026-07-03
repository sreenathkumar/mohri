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

const roleColors: { [key: string]: string } = {
    "user": "bg-red-100 text-red-600",
    'clerk': 'bg-blue-100 text-blue-600',
    'driver': 'bg-yellow-100 text-yellow-600',
    'admin': 'bg-green-100 text-green-600'
}

export default function EmployeeTable({ employees, selectedItems, setSelectedItems }: Props) {

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={selectedItems.length === employees.length}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedItems(employees.map(t => t.id))
                                    } else {
                                        setSelectedItems([])
                                    }
                                }}
                            />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length > 0 ? employees.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedItems.includes(employee.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedItems([...selectedItems, employee.id])
                                        } else {
                                            setSelectedItems(selectedItems.filter(id => id !== employee.id))
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Link className="hover:underline" href={`/merchant/employees/${employee.id}`}>{employee.name}</Link>
                            </TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>
                                <Badge
                                    className={roleColors[employee.role] || 'bg-gray-100 text-gray-600'}
                                >
                                    {employee.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-4">
                                    <UpdateEmployee data={employee} />
                                    <DeleteEmployee selectedItems={[employee.id]} setSelectedItems={setSelectedItems}>
                                        <Button variant="ghost" size="icon">
                                            <Trash />
                                        </Button>
                                    </DeleteEmployee>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : <TableRow><TableCell colSpan={5} className="text-center">No employees found</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}

