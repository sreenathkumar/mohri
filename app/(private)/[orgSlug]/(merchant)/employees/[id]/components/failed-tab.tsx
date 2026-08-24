import { Badge } from "@/components/shadcn/badge";
import { CardContent } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import CheckAll from "./check-all";
import SelectOrder from "./select-order";
import { OrderStatus } from '@lib/prisma';
import { getDriverAssignedOrders } from "@/actions/driverActions";

//table columns for the processing orders table
const tableColumns = ['Order Number', 'Name', 'City', 'Phone Number', 'Payment', 'Amount', 'Status'];

async function FailedTab({ id }: { id: string }) {
    const orders = await getDriverAssignedOrders({
        driverId: id,
        filter: {
            status: {
                in: [OrderStatus.FAILED]
            }
        }
    });

    return (
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <CheckAll orders={orders} />
                        </TableHead>
                        {
                            tableColumns?.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        orders.length === 0 ? <TableRow><TableCell colSpan={tableColumns.length} className="text-center text-red-500">No orders found</TableCell></TableRow> :
                            orders.map((order) => (
                                <TableRow key={order.order_id}>
                                    <TableCell>
                                        <SelectOrder status={order.status} order={JSON.stringify(order)} />
                                    </TableCell>
                                    <TableCell className="font-medium">{order.order_id}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.city}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
                                    <TableCell>{order.payment === 'cod' ? 'Cash On Delivery' : 'PAID'}</TableCell>
                                    <TableCell>{order.payment === 'cod' ? order.amount : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant='destructive'
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </CardContent>
    )
}

export default FailedTab