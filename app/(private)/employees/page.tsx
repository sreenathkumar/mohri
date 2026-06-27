import { getAllEmployees } from "@/actions/employee"
import EmployeeTableWrapper from "./components/EmployeeTableWrapper"
import { getServerSessionContext } from "@/lib/checkServerAuth";
import { redirect } from "next/navigation";


async function EmployeesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

    const { role } = await getServerSessionContext()

    if (role === 'driver') {
        redirect('/dashboard');
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