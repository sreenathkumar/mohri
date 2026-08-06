import { getDashboarBarchartData } from "@/actions/analyticsActions";
import { Suspense } from "react";
import DashboardBarChart from "./barchart-content";

async function DashboardBarchartSection() {
    const bardata = await getDashboarBarchartData('last7');
    return (
        <section className="flex flex-col gap-4 mt-10">
            <Suspense fallback={<span>Loading bar chart data</span>}>
                <DashboardBarChart initialData={bardata} />
            </Suspense>
        </section>
    )
}

export default DashboardBarchartSection