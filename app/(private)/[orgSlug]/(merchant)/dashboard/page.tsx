import DashboardBarchartSection from "./components/barchart-section";
import OverviewCards from "./components/overview-cards";

async function AdminDashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 py-8 overflow-y-auto scrollbar-none">
            <OverviewCards />
            <DashboardBarchartSection />
        </div>
    )
}


export default AdminDashboardPage