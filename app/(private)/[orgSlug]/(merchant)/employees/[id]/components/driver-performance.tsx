import { Suspense } from "react"
import DriverPerformanceChart from "./driver-performance-chart"
import { getDriverPerformanceMetrics } from "@/actions/analyticsActions";


async function DriverPerformance({ id }: { id: string }) {
    const initialData = await getDriverPerformanceMetrics({ userId: id, preset: 'last7' });
    return (
        <section className="rounded-2xl border border-border bg-card p-6">
            <Suspense fallback={<div className="text-sm text-slate-400">Loading performance chart...</div>}>
                <DriverPerformanceChart initialData={initialData} userId={id} />
            </Suspense>

        </section>
    )
}

export default DriverPerformance