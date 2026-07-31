import { Suspense } from "react"
import AllOrdersReport from "./components/AllOrdersReport";
import LinkPaidReport from "./components/LinkPaidReport";
import CashPaidReport from "./components/CashPaidReport";
import StatCard from "./components/stat-card";


interface AdminDashboardProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

async function AdminDashboardPage({ searchParams }: AdminDashboardProps) {

    return (
        <div className="flex flex-1 flex-col gap-4 py-8 overflow-y-auto no-scrollbar">
            <StatCard />
            {/* <Suspense fallback={<span>Loading delivered orders data</span>}>
                <AllOrdersReport from={stringFromArray(delivery_from)} to={stringFromArray(delivery_to)} />
            </Suspense>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Suspense fallback={<span>Loading Link Paid reports</span>}>
                    <LinkPaidReport from={stringFromArray(link_paid_from)} to={stringFromArray(link_paid_to)} />
                </Suspense>
                <Suspense fallback={<span>Loading Cash Paid reports</span>}>
                    <CashPaidReport from={stringFromArray(cash_paid_from)} to={stringFromArray(cash_paid_to)} />
                </Suspense>
            </div> */}
        </div>
    )
}

function stringFromArray(target: string | string[] | undefined) {
    if (target && Array.isArray(target)) {
        return target.join('_')
    }

    return target
}

export default AdminDashboardPage