'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn/chart"
import { convertToLocalTime } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OrdersChart({ chartData }: { chartData: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[40vh] w-full md:h-[60vh]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => convertToLocalTime(value)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="orders"
          stackId="a"
          fill="var(--color-orders)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

export default OrdersChart