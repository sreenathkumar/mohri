import {
    Card,
    CardContent
} from "@/components/shadcn/card"
import ChartHeader from "./ChartHeader"


export function AnalyticsCard({ children, title = "Analytics", chartKey }: { children: React.ReactNode, title: string, chartKey: string }) {

    return (
        <Card className="w-full bg-transparent">
            <ChartHeader title={title} chartKey={chartKey} />
            <CardContent className="text-center">
                {children}
            </CardContent>
        </Card>
    )
}

export default AnalyticsCard