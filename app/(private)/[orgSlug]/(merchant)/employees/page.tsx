import { getAllEmployees } from "@/actions/employee"
import EmployeeTableWrapper from "./components/EmployeeTableWrapper"
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic'

async function EmployeesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

    const session = await auth();

    if (session?.user.role === 'driver') {
        redirect('/driver/dashboard');
    }


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
        <EmployeeTableWrapper employees={employees} />
    )
}

export default EmployeesPage