import { getAssignedOrders } from "@/actions/orders";
import { Badge } from "@/components/shadcn/badge";
import { CardContent } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import CheckAll from "./CheckAll";
import SelectOrder from "./SelectOrder";

//table columns for the processing orders table
const tableColumns = ['Order Number', 'Name', 'City', 'Phone Number', 'Payment', 'Amount', 'Status'];

async function ProcessingTab({ id }: { id: string }) {
    const orders = await getAssignedOrders({ id, status: 'processing' });

    return (
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <CheckAll status="processing" orders={orders} />
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
                                        <SelectOrder status={'processing'} order={JSON.stringify(order)} />
                                    </TableCell>
                                    <TableCell className="font-medium">{order.order_id}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.city}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
                                    <TableCell>{order.payment === 'hesabe' ? 'PAID' : 'Cash On Delivery'}</TableCell>
                                    <TableCell>{order.payment === 'hesabe' ? 'N/A' : order.amount}</TableCell>
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
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </CardContent>
    )
}

export default ProcessingTab