import AdminDashboard from './components/AdminDashboard'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
    const allSearchParams = await searchParams;

    return (
        <AdminDashboard searchParams={allSearchParams} />
    )
}

export default DashboardPage