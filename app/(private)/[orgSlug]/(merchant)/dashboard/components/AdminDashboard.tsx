import { Suspense } from "react"
import AllOrdersReport from "./AllOrdersReport"
import CashPaidReport from "./CashPaidReport"
import LinkPaidReport from "./LinkPaidReport"

interface AdminDashboardProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

async function AdminDashboard({ searchParams }: AdminDashboardProps) {
    const { delivery_from, delivery_to, link_paid_from, link_paid_to, cash_paid_from, cash_paid_to, } = searchParams;

    return (
        <div className="flex flex-1 flex-col gap-4 py-8 overflow-y-auto no-scrollbar">
            <Suspense fallback={<span>Loading delivered orders data</span>}>
                <AllOrdersReport from={stringFromArray(delivery_from)} to={stringFromArray(delivery_to)} />
            </Suspense>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Suspense fallback={<span>Loading Link Paid reports</span>}>
                    <LinkPaidReport from={stringFromArray(link_paid_from)} to={stringFromArray(link_paid_to)} />
                </Suspense>
                <Suspense fallback={<span>Loading Cash Paid reports</span>}>
                    <CashPaidReport from={stringFromArray(cash_paid_from)} to={stringFromArray(cash_paid_to)} />
                </Suspense>
            </div>
        </div>
    )
}

function stringFromArray(target: string | string[] | undefined) {
    if (target && Array.isArray(target)) {
        return target.join('_')
    }

    return target
}

export default AdminDashboard