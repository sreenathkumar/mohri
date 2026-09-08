import { getAllEmployees } from "@/actions/employeeActions"

import { Badge } from "@/components/shadcn/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { getServerSession } from "@/lib/auth-context"
import Link from "next/link"
import DeleteEmployeeBtn from "./components/delete-employee-btn"
import UpdateEmployee from "./components/update-employee"
import SearchField from "@/components/ui/SearchField"
import AddEmployee from "./components/add-employee"

const roleColors: Record<string, string> = {
    admin: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20",
    clerk: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20",
    driver: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20",
    user: "bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border-violet-500/20"
}

async function EmployeesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const session = await getServerSession()
    let employees = await getAllEmployees();
    const { query } = await searchParams;

    if (query) {
        employees = employees.filter(employee => {
            if (employee.name.toLowerCase().includes(query as string) || employee.role.toLowerCase().includes(query as string)) {
                return employee
            }
        });
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-6 gap-4">
                <SearchField className='w-80' />
                <AddEmployee />
            </div>
            <Table className="border rounded-lg">
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
                                <Link className="hover:underline" href={session?.session.userId === employee.userId ? './profile' : `./employees/${employee.userId}`}>{employee.name}</Link>
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
                                    <DeleteEmployeeBtn email={employee.email} />
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : <TableRow><TableCell colSpan={4} className="px-6 py-4 font-medium text-center">No employees found</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}

export default EmployeesPage