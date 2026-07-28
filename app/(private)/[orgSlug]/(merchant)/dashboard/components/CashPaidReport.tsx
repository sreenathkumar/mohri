import { getReportByPaymentType } from "@/actions/reports/getMoneyCollectionReport"
import AnalyticsCard from "./AnalyticsCard"
import CollectionChart from "./CollectionChart"

async function CashPaidReport({ from, to }: { from?: string, to?: string }) {
    const report = await getReportByPaymentType({ from, to, paymentType: 'cash_paid' });
    return (
        <AnalyticsCard title="Cash Paid" chartKey="cash_paid">
            {
                report.length > 0 ? <CollectionChart chartData={report} /> : <span className="text-red-500 font-bold font-base">NO data found</span>
            }

        </AnalyticsCard>
    )
}

export default CashPaidReport