import getOrdersReport from "@/actions/reports/getOrdersReport"
import AnalyticsCard from "./AnalyticsCard"
import OrdersChart from "./OrdersChart"

async function AllOrdersReport({ from, to }: { from?: string, to?: string }) {
    const report = await getOrdersReport({ from, to });

    return (
        <AnalyticsCard title="Total Orders" chartKey="delivery">
            {
                report.length > 0 ? <OrdersChart chartData={report} /> : <span className="text-red-500 font-bold font-base">NO data found</span>
            }
        </AnalyticsCard>
    )
}

export default AllOrdersReport