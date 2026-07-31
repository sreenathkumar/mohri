import { getAllEmployees } from "@/actions/employeeActions"
import EmployeeTableWrapper from "./components/EmployeeTableWrapper"

async function EmployeesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
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