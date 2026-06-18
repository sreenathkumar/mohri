import getOrders from "@/actions/woocommerce/getOrders";
import { auth } from "@/auth";
import { Table, TableHeader, } from "@/components/shadcn/table";
import { OrderType } from "@/types/OrderType";
import { redirect } from "next/navigation";
import TableHeadRowItem from "./TableHeadRowItem";
import OrdersTableContent from "./OrdersTableContent";
import OrderPagination from "./OrderPagination";


const tableColumns = ['Order Number', 'Name', 'City', 'Address', 'Phone Number', 'Payment', 'Amount', 'Status', 'Asignee', 'Actions'];

async function OrdersTable({ query, sort }: { query: string | string[] | undefined, sort: string | string[] | undefined }) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    const { orders, totalPages }: { orders: OrderType[], totalPages: number, currentPage: number } = await getOrders({ query, sort });

    return (
        <div className="flex flex-col gap-4">
            <div className="border rounded-lg w-full overflow-x-auto">
                <Table className="border-collapse">
                    <TableHeader className="sticky top-0 z-10 bg-background shadow">
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