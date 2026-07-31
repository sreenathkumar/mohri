import { getOrders } from "@/actions/orderActions";
import { Table, TableHeader, } from "@/components/shadcn/table";
import OrderPagination from "./OrderPagination";
import OrdersTableContent from "./OrdersTableContent";
import TableHeadRowItem from "./TableHeadRowItem";


const tableColumns = ['Order Number', 'Name', 'City', 'Address', 'Phone Number', 'Payment', 'Amount', 'Status', 'Asignee', 'Actions'];

async function
    OrdersTable({ query, sort }: { query: string | undefined, sort: string | undefined }) {
    const { orders, totalPages } = await getOrders({ query, sort });

    return (
        <div className="flex flex-col gap-4">
            <div className="border rounded-lg w-full overflow-x-auto">
                <Table className="border-collapse">
                    <TableHeader className="bg-muted/30">
                        <TableHeadRowItem columns={tableColumns} orderIds={orders.map(order => order.order_id)} />
                    </TableHeader>
                    <OrdersTableContent columns={tableColumns.length} fallbackData={orders} />
                </Table>
            </div>
            {totalPages > 1 && <div className="flex gap-2">
                <OrderPagination totalPages={totalPages} />
            </div>}
        </div>

    )
}

export default OrdersTable