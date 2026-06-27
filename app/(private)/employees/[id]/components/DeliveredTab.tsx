import { getAssignedOrders } from "@/actions/orders";
import { Badge } from "@/components/shadcn/badge";
import { CardContent } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import CheckAll from "./CheckAll";
import DeliveryDate from "./DeliveryDate";
import SelectOrder from "./SelectOrder";


//table columns for the delivered orders table
const tableColumns = ['Order Number', 'Status', 'Delivery Date', 'Payment', 'Amount'];

async function DeliveredTab({ id }: { id: string }) {
    const orders = await getAssignedOrders({ id, status: 'delivered' });

    return (
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <CheckAll status="delivered" orders={orders} />
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
                                        <SelectOrder
                                            status={'processing'}
                                            order={JSON.stringify(order)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{order.order_id}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={order.status === 'completed' ? 'success' : 'warning'}
                                            className={
                                                order.status === 'completed'
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <DeliveryDate date={order.date_delivered} />
                                    <TableCell>{order.payment === 'hesabe' ? 'PAID' : 'Cash On Delivery'}</TableCell>
                                    <TableCell>{order.payment === 'hesabe' ? 'N/A' : order.amount}</TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </CardContent>
    )
}

export default DeliveredTab