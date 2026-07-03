'use client'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart"
import { useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"

// config for the chart
const chartConfig = {
    total_amount: {
        label: "Amount",
    },

} satisfies ChartConfig



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CollectionChart({ chartData }: { chartData: any[] }) {
    const totalAmount = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.total_amount, 0)
    }, [chartData]);

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="total_amount"
                    nameKey="assignee_name"
                    innerRadius={60}
                    strokeWidth={5}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {totalAmount.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Total Collection
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}

export default CollectionChart