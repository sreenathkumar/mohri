import DashboardBarchartSection from "./components/barchart-section";
import OverviewCards from "./components/overview-cards";


interface AdminDashboardProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

async function AdminDashboardPage({ searchParams }: AdminDashboardProps) {

    return (
        <div className="flex flex-1 flex-col gap-4 py-8 overflow-y-auto scrollbar-none">
            <OverviewCards />
            <DashboardBarchartSection />
        </div>
    )
}


export default AdminDashboardPage