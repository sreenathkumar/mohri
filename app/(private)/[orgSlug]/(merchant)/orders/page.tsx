import SearchField from "@/components/ui/SearchField"
import { SelectedOrderProvider } from "@/context/SelectedOrderCtx"
import { decodeSearchParams } from "@/lib/utils"
import { Suspense } from "react"
import UpdateOrderBtn from "./components/UpdateOrderBtn"
import OrdersTable from "./components/OrdersTable"
import SyncBtn from "./components/SyncBtn"
import FilterBtn from "./components/FilterBtn"
import CopyBtn from "./components/CopyBtn"
import TableSkeleton from "@/components/ui/TableSkeleton"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
const defaultTableColumns = ['Order Number', 'Name', 'City', 'Address', 'Phone Number', 'Payment', 'Amount', 'Status', 'Asignee', 'Actions'];


async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
    const { query, sort } = decodeSearchParams(await searchParams);

    // Format query and sort parameters to ensure they are strings or undefined
    const formattedQuery = (Array.isArray(query) ? query.join(' ') : query) || undefined;
    const formattedSort = (Array.isArray(sort) ? sort[0] : sort) || undefined;
    return (
        <div className="pt-8 pb-4 flex flex-col flex-1 overflow-auto">
            <SelectedOrderProvider>
                <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row lg:items-center">
                    <div className="flex gap-2 justify-between items-center flex-1">
                        <SearchField className='max-w-80' />
                        <SyncBtn />
                    </div>
                    <div className="flex gap-2 items-center justify-between">
                        <CopyBtn />
                        <div className="flex gap-2 items-center justify-between grow">
                            <FilterBtn />
                            <UpdateOrderBtn />
                        </div>
                    </div>
                </div>
                <Suspense fallback={<TableSkeleton columns={defaultTableColumns} />}>
                    <OrdersTable query={formattedQuery} sort={formattedSort} />
                </Suspense>
            </SelectedOrderProvider>
        </div>
    )
}

export default OrdersPage