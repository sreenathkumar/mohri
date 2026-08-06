import { getDashOverviewStat } from "@/actions/analyticsActions";
import StatCard from "./stat-card";


async function OverviewCards() {
    //const metricsData = await getDashOverviewStat();
    let metricsData = {
        ordersToday: 0,
        pendingAssignment: 0,
        outForDelivery: 0,
        deliveredToday: 0,
        cashCollected: 0,
    };
    return (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(248px,1fr))] gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
            <StatCard
                title="Orders Today"
                description="Total orders come till now"
                change="0%"
                value={metricsData?.ordersToday || 0}
            />
            <StatCard
                title="Pending Assignment"
                description="Needs to assign to a driver"
                value={metricsData.pendingAssignment || 0}
            />
            <StatCard
                title="Out for Delivery"
                description="Orders are out for delivery today"
                value={metricsData.outForDelivery || 0}
            />
            <StatCard
                title="Delivered Today"
                description="Total orders delivered today"
                value={metricsData.deliveredToday || 0}
            />
            <StatCard
                title="COD Collected Today"
                description="Total cash collected today"
                value={metricsData.cashCollected || '$0'}
            />
        </section>
    )
}

export default OverviewCards