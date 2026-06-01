import getOrders from "@/actions/woocommerce/getOrders";
import { auth } from "@/auth";
import { Table, TableHeader, } from "@/components/shadcn/table";
import { OrderType } from "@/types/OrderType";
import { redirect } from "next/navigation";
import InfiniteTableContent from "./InfiniteTableContent";
import TableHeadRowItem from "./TableHeadRowItem";


const tableColumns = ['Order Number', 'Name', 'City', 'Address', 'Phone Number', 'Payment', 'Amount', 'Status', 'Asignee', 'Actions'];

async function OrdersTable({ query, sort }: { query: string | string[] | undefined, sort: string | string[] | undefined }) {
    const session = await auth();
    if (!session) {
        redirect('/login');
    }

    //get the user id from the session
    const userId = session?.user?.id
    const role = session?.user?.role

    const { orders }: { orders: OrderType[], totalPages: number, currentPage: number } = await getOrders({ query, userId, role, sort });

    return (
        <>
            <div className="border rounded-lg w-full overflow-x-auto">
                <Table className="border-collapse">
                    <TableHeader className="sticky top-0 z-10 bg-background shadow">
                        <TableHeadRowItem columns={tableColumns} orderIds={orders.map(order => order.order_id)} />
                    </TableHeader>
                    <InfiniteTableContent columns={tableColumns.length} />
                </Table>
            </div>
        </>

    )
}

export default OrdersTable