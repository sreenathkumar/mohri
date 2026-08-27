import { getEmployeeById } from "@/actions/employeeActions";
import { Card, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { ClipboardProvider } from "@/context/ClipboardCtx";
import CopyOrders from "./components/CopyOrders";
import DeliveredTab from "./components/delivery-tab";
import DetailedProfile from "./components/detailed-profile";
import DriverPerformance from "./components/driver-performance";
import FailedTab from "./components/failed-tab";
import ManagerPerformance from "./components/manager-performance";
import ProcessingTab from "./components/processing-tab";
import ProfileHighlight from "./components/profile-highlight";

interface EmployeePageProps {
    params: Promise<{
        id: string;
    }>;
}

async function EmployeePage({ params }: EmployeePageProps) {
    const { id } = await params;
    const employee = await getEmployeeById(id)

    if (!employee) {
        return (
            <div className="flex items-center space-x-4 text-gray-400">
                Your information is not available.
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 space-y-6 overflow-y-auto">
            <div>
                <p className="text-sm text-slate-400">People / Employees</p>
                <h1 className="text-2xl font-bold tracking-tight text-white">Employee profile</h1>
            </div>

            <ProfileHighlight user={employee} />

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                {
                    employee.role === 'driver' ?
                        <DriverPerformance id={id} /> :
                        <ManagerPerformance userId={id} />
                }
                <DetailedProfile employee={employee} />
            </div>

            {employee.role === 'driver' && <Card className="p-6 bg-transparent">
                <CardHeader>
                    <CardTitle>Assigned Orders</CardTitle>
                </CardHeader>
                <div className="relative">
                    <ClipboardProvider>
                        <Tabs defaultValue="processing">
                            <TabsList>
                                <TabsTrigger value="processing" className="cursor-pointer">Processing</TabsTrigger>
                                <TabsTrigger value="delivered" className="cursor-pointer">Delivered</TabsTrigger>
                                <TabsTrigger value="failed" className="cursor-pointer">Failed</TabsTrigger>
                            </TabsList>
                            <TabsContent value="processing">
                                <ProcessingTab id={employee.id} />
                            </TabsContent>
                            <TabsContent value="delivered">
                                <DeliveredTab id={employee.id} />
                            </TabsContent>
                            <TabsContent value="failed">
                                <FailedTab id={employee.id} />
                            </TabsContent>
                        </Tabs>
                        <CopyOrders />
                    </ClipboardProvider>
                </div>
            </Card>}
        </div>
    )
}

export default EmployeePage