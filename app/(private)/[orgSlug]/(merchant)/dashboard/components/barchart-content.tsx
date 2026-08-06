'use client'
import { getDashboarBarchartData } from "@/actions/analyticsActions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/shadcn/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import { BarChartDataPoints } from "@/services/analytics"
import { OrderStatus } from "@prisma/client"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig: ChartConfig = {
  orders: {
    label: "Orders",
  },
  [OrderStatus.PROCESSING]: {
    label: "Processing",
    color: "var(--chart-1)",
  },
  [OrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "var(--chart-2)",
  },
  [OrderStatus.FAILED]: {
    label: "Failed",
    color: "var(--chart-3)",
  },
}


function DashboardBarChart({ initialData }: { initialData: BarChartDataPoints[] }) {
  const [chartData, setChartData] = useState<BarChartDataPoints[]>(initialData);
  const [activePreset, setActivePreset] = useState<'last7' | 'last30' | 'last90'>('last7');
  const [activeStatus, setActiveStatus] = useState<keyof typeof chartConfig>('PROCESSING');


  const total = useMemo(() => ({
    [OrderStatus.PROCESSING]: chartData.reduce((acc, curr) => acc + curr[OrderStatus.PROCESSING], 0),
    [OrderStatus.DELIVERED]: chartData.reduce((acc, curr) => acc + curr[OrderStatus.DELIVERED], 0),
    [OrderStatus.FAILED]: chartData.reduce((acc, curr) => acc + curr[OrderStatus.FAILED], 0),
  }), [chartData]);


  // Fetch chart data when activePreset changes
  useEffect(() => {
    async function fetchData() {
      const data = await getDashboarBarchartData(activePreset);
      setChartData(data);
    }
    fetchData();
  }, [activePreset]);

  return (
    <>
      <div className="flex flex items-center justify-between space-x-2">
        <span className="text-sm text-muted-foreground">Checkout how the orders are performing</span>
        <Select value={activePreset} onValueChange={(value) => setActivePreset(value as 'last7' | 'last30' | 'last90')}>
          <SelectTrigger
            className="rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="last90" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="last30" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="last7" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
            <CardTitle>Orders and Delivery Trend</CardTitle>
            <CardDescription>
              Showing the trend of orders and deliveries for the last {
                activePreset === 'last7' ? 7 : activePreset === 'last30' ? 30 : 90
              } days.
            </CardDescription>
          </div>
          <div className="flex">
            {[OrderStatus.PROCESSING, OrderStatus.DELIVERED, OrderStatus.FAILED].map((key) => {
              const chart = key as keyof typeof chartConfig
              return (
                <button
                  key={chart}
                  data-active={activeStatus === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveStatus(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Bar dataKey={activeStatus} fill={`var(--color-${activeStatus})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>

  )
}

export default DashboardBarChart