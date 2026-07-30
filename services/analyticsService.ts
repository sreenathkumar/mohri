import { prisma } from "@/lib/prisma";
import { differenceInDays, subDays } from "date-fns";

export interface ReportDateParams {
  from?: string; // ISO / UTC string
  to?: string;   // ISO / UTC string
  organizationId: string; 
}

export interface DeliveredOrderReportItem {
  time: string;
  orders: number;
}

/**
 * Service to aggregate delivered/created orders grouped by time intervals.
 */
export async function fetchDeliveredOrderAnalytics({
  from,
  to,
  organizationId,
}: ReportDateParams): Promise<DeliveredOrderReportItem[]> {
  if (!organizationId) return [];

  const { startDate, endDate } = getDateRange(from, to);
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Fetch target orders scoped by Organization and Date Range
  const orders = await prisma.order.findMany({
    where: {
      organizationId,
      date_created_gmt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      date_created_gmt: true,
    },
    orderBy: {
      date_created_gmt: "asc",
    },
  });

  if (orders.length === 0) return [];

  const difference = differenceInDays(end, start) + 1;
  const countsMap = new Map<string, number>();

  // Perform time-interval grouping in memory
  for (const order of orders) {
    const key = formatGroupKey(order.date_created_gmt, difference);
    countsMap.set(key, (countsMap.get(key) || 0) + 1);
  }

  // Format output array sorted by time key
  return Array.from(countsMap.entries())
    .map(([time, orders]) => ({ time, orders }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Calculates start and end ISO dates based on optional inputs.
 */
function getDateRange(from?: string, to?: string) {
  const defaultInterval = Number(process.env.DEFAULT_DATE_INTERVAL) || 14;

  if (!from && !to) {
    return {
      startDate: subDays(new Date(), defaultInterval).toISOString(),
      endDate: new Date().toISOString(),
    };
  }

  if (from && !to) {
    const cleanFrom = from.split("T")[0];
    return {
      startDate: `${cleanFrom}T00:00:00.000Z`,
      endDate: `${cleanFrom}T23:59:59.999Z`,
    };
  }

  if (to && !from) {
    const cleanTo = to.split("T")[0];
    const computedStart = subDays(new Date(to), defaultInterval).toISOString().split("T")[0];
    return {
      startDate: `${computedStart}T00:00:00.000Z`,
      endDate: `${cleanTo}T23:59:59.999Z`,
    };
  }

  return {
    startDate: from,
    endDate: to,
  };
}

/**
 * Generates group bucket keys matching the previous Mongoose aggregation logic.
 */
function formatGroupKey(date: Date, diffDays: number): string {
  if (diffDays <= 1) {
    const hour = Math.floor(date.getUTCHours() / 2) * 2;
    return `${hour}.00-${hour + 2}.00`;
  } else if (diffDays <= 30) {
    // YYYY-MM-DD
    return date.toISOString().split("T")[0];
  } else if (diffDays <= 365) {
    // YYYY-MM
    return date.toISOString().slice(0, 7);
  } else {
    // YYYY
    return date.getUTCFullYear().toString();
  }
}