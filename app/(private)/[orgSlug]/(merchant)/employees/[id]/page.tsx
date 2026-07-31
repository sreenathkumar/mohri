import { getCurrentUser } from "@/actions/userActions";
import { Card, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { ClipboardProvider } from "@/context/ClipboardCtx";
import { Suspense } from "react";
import CopyOrders from "./components/CopyOrders";
import DeliveredTab from "./components/DeliveredTab";
import ProcessingTab from "./components/ProcessingTab";
import UserInfo from "./components/UserInfo";


async function EmployeePage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex items-center space-x-4 text-gray-400">
                Your information is not available.
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 space-y-6 overflow-y-auto">
            <Card className="p-6 bg-transparent">
                <CardHeader className="p-0 mb-12">
                    <CardTitle>Employee Details</CardTitle>
                </CardHeader>
                <UserInfo user={({
                    name: user?.name || 'John Doe',
                    image: user?.image || undefined,
                    address: user?.address || 'No address'
                })} />
            </Card>

            <Card className="p-6 bg-transparent">
                <CardHeader>
                    <CardTitle>Assigned Orders</CardTitle>
                </CardHeader>
                <div className="relative">
                    <ClipboardProvider>
                        <Tabs defaultValue="processing">
                            <TabsList>
                                <TabsTrigger value="processing">Processing</TabsTrigger>
                                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                            </TabsList>
                            <TabsContent value="processing">
                                <Suspense fallback={<div>Loading assigned orders...</div>}>
                                    <ProcessingTab id={user.id} />
                                </Suspense>
                            </TabsContent>
                            <TabsContent value="delivered">
                                <Suspense fallback={<div>Loading assigned orders...</div>}>
                                    <DeliveredTab id={user.id} />
                                </Suspense>
                            </TabsContent>
                        </Tabs>
                        <CopyOrders />
                    </ClipboardProvider>
                </div>
            </Card>
        </div>
    )
}

export default EmployeePage