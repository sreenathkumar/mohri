import { OrderStatus, prisma } from "@/lib/prisma";

export interface BarChartParams {
  preset?: 'last7' | 'last30' | 'last90';
  organizationId: string;
}

export interface BarChartDataPoints {
  date: string;
  [OrderStatus.PROCESSING]: number;
  [OrderStatus.DELIVERED]: number;
  [OrderStatus.FAILED]: number;
}

/**
 * Fetch the order placed, delivered, and failed bar chart data for the dashboard
 */
export async function fetchOrderBarChartData({ organizationId, preset }: BarChartParams) {
  if (!organizationId) return [];

  //get the organization's timezone
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { timezone: true },
  });

  const tz = organization?.timezone || 'UTC'; //the timezone of the organization

  let days = 7;
  let bucketCount = 7;

  if (preset === 'last30') {
    days = 30;
    bucketCount = 10;
  } else if (preset === 'last90') {
    days = 90;
    bucketCount = 12; //grouped by week
  }

  //the moment it clicked,
  const now = new Date();

  //get the local time in the business timezone
  const localTodayStart = getStartOfLocalDay(now, tz);
  const startDate = new Date(localTodayStart);
  startDate.setDate(startDate.getDate() - (days - 1)); //subtract days to get the start date

  //create a map to hold the counts for each date
  const dateMap = new Map<string, BarChartDataPoints>();
  const loopCurrentDate = new Date(startDate);

  //pre filled the dateMap with all the dates in the range, so that we have a bucket for each day
  while (loopCurrentDate <= now) {
    const dateStr = getLocalDateString(loopCurrentDate, tz);
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        date: dateStr,
        [OrderStatus.PROCESSING]: 0,
        [OrderStatus.DELIVERED]: 0,
        [OrderStatus.FAILED]: 0
      });
    }
    loopCurrentDate.setDate(loopCurrentDate.getDate() + 1);
  }

  const dbResults = await prisma.order.findMany({
    where: {
      organizationId,
      date_created_gmt: {
        gte: startDate,
        lte: now
      },
      status: { in: [OrderStatus.PROCESSING, OrderStatus.DELIVERED, OrderStatus.FAILED] }
    },
    select: {
      date_created_gmt: true,
      status: true
    }
  });

  //replace the dateMap with the actual counts from the dbResults
  for (const record of dbResults) {
    const dateStr = getLocalDateString(record.date_created_gmt, tz);
    const entry = dateMap.get(dateStr);

    if (entry) {
      const status = record.status;
      if (status === OrderStatus.PROCESSING) entry[OrderStatus.PROCESSING]++;
      else if (status === OrderStatus.DELIVERED) entry[OrderStatus.DELIVERED]++;
      else if (status === OrderStatus.FAILED) entry[OrderStatus.FAILED]++;
    }
  }


  return Array.from(dateMap.values())
}


//get the start of the day in the local timezone
function getStartOfLocalDay(date: Date, timezone: string): Date {
  const dateStr = getLocalDateString(date, timezone);

  return new Date(`${dateStr}T00:00:00.000Z`);
}

// format a date to yyyy-mm-dd in the given timezone
function getLocalDateString(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return formatter.format(date)
}
