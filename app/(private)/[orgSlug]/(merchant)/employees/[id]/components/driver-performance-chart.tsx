'use client'
import { getDriverPerformanceMetrics } from "@/actions/analyticsActions";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/shadcn/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { DriverPerformanceDataPoints } from "@/services/analytics";
import { OrderStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig: ChartConfig = {
  orders: {
    label: "Orders",
  },
  [OrderStatus.ASSIGNED]: {
    label: "Assigned",
    color: "var(--chart-1)",
  },
  [OrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "var(--chart-2)",
  },
}

function DriverPerformanceChart({ initialData, userId }: { initialData: DriverPerformanceDataPoints[], userId: string }) {
  const [chartData, setChartData] = useState<DriverPerformanceDataPoints[]>(initialData);
  const [activePreset, setActivePreset] = useState<'last7' | 'last30' | 'last90'>('last7');

  // Fetch chart data when switching to a preset that needs a server request.
  useEffect(() => {
    if (activePreset === 'last7') return;

    let cancelled = false;

    (async () => {
      const data = await getDriverPerformanceMetrics({ userId, preset: activePreset });
      if (!cancelled) {
        setChartData(data);
      }
    })();

    return () => { cancelled = true; };
  }, [activePreset, userId]);

  // Reset to `initialData` synchronously when switching back to 'last7',
  // via the render-time derived-state pattern instead of an effect.
  const [prevPreset, setPrevPreset] = useState(activePreset);
  if (activePreset !== prevPreset) {
    setPrevPreset(activePreset);
    if (activePreset === 'last7') {
      setChartData(initialData);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white">Performance overview</h2>
          <p className="mt-1 text-sm text-slate-400">Delivery activity for the last 7 days</p>
        </div>

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
          <Bar dataKey={OrderStatus.ASSIGNED} fill={`var(--color-${OrderStatus.ASSIGNED})`} />
          <Bar dataKey={OrderStatus.DELIVERED} fill={`var(--color-${OrderStatus.DELIVERED})`} />
        </BarChart>
      </ChartContainer>
    </>
  )
}

export default DriverPerformanceChart