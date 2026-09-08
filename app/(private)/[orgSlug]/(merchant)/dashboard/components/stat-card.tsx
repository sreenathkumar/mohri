import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/shadcn/card";

interface StatCardProps {
    title?: string;
    value?: string | number;
    change?: string;
    description?: string;
}

function StatCard({
    title,
    value,
    change,
    description
}: StatCardProps) {

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title || 'title_error'}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {value || 'N/A'}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                    {description || 'description_error'}
                </div>
            </CardFooter>
        </Card>
    )
}

export default StatCard