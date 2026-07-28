import { getReportByPaymentType } from "@/actions/reports/getMoneyCollectionReport"
import AnalyticsCard from "./AnalyticsCard"
import CollectionChart from "./CollectionChart"

async function LinkPaidReport({ from, to }: { from?: string, to?: string }) {

    const report = await getReportByPaymentType({ from, to, paymentType: 'link_paid' });
    return (
        <AnalyticsCard title="Link Paid" chartKey="link_paid">
            {
                report.length > 0 ? <CollectionChart chartData={report} /> : <span className="text-red-500 font-bold font-base">NO data found</span>
            }

        </AnalyticsCard>
    )
}

export default LinkPaidReport