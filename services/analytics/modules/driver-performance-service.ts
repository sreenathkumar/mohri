import prisma, { OrderStatus } from "@/lib/prisma";
import { getLocalDateString, getStartOfLocalDay } from "../date-utlls";

interface DriverPerformanceMetricParams {
    userId: string;
    organizationId: string;
    preset?: 'last7' | 'last30' | 'last90';
}

export type DriverPerformanceDataPoints = {
    date: string;
    [OrderStatus.ASSIGNED]: number;
    [OrderStatus.DELIVERED]: number;
}

export async function fetchDriverPerformanceMetrics({
    userId,
    preset,
    organizationId
}: DriverPerformanceMetricParams) {
    if (!userId || !organizationId) throw new Error('userId and organizationId are required');

    //get the organization's timezone
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { timezone: true },
    });

    const tz = organization?.timezone || 'UTC'; //the timezone of the organization

    let days = 7;

    if (preset === 'last30') {
        days = 30;
    } else if (preset === 'last90') {
        days = 90;
    }

    //the moment it clicked,
    const now = new Date();

    //get the local time in the business timezone
    const localTodayStart = getStartOfLocalDay(now, tz);
    const startDate = new Date(localTodayStart);
    startDate.setDate(startDate.getDate() - (days - 1)); //subtract days to get the start date

    //create a map to hold the counts for each date
    const dateMap = new Map<string, DriverPerformanceDataPoints>();
    const loopCurrentDate = new Date(startDate);

    //pre filled the dateMap with all the dates in the range, so that we have a bucket for each day
    while (loopCurrentDate <= now) {
        const dateStr = getLocalDateString(loopCurrentDate, tz);
        if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, {
                date: dateStr,
                [OrderStatus.ASSIGNED]: 0,
                [OrderStatus.DELIVERED]: 0,
            });
        }
        loopCurrentDate.setDate(loopCurrentDate.getDate() + 1);
    }

    const dbResults = await prisma.order.findMany({
        where: {
            organizationId,
            assigneeId: userId,
            updatedAt: {
                gte: startDate,
                lte: now
            }
        },
        select: {
            updatedAt: true,
            status: true
        }
    });

    //replace the dateMap with the actual counts from the dbResults
    for (const record of dbResults) {
        const dateStr = getLocalDateString(record.updatedAt, tz);
        const entry = dateMap.get(dateStr);

        if (entry) {
            const status = record.status;
            if (status === OrderStatus.DELIVERED) entry[OrderStatus.DELIVERED]++;
            else entry[OrderStatus.ASSIGNED]++;
        }
    }


    return Array.from(dateMap.values())
}

interface DriverAnalyticsParams {
    userId: string;
    organizationId: string;
}
export async function fetchDriverAnalytics({ userId, organizationId }: DriverAnalyticsParams) {
    if (!userId || !organizationId) throw new Error('userId and organizationId are required');

    const totalDeliveries = await prisma.order.findMany({
        where: {
            organizationId,
            assigneeId: userId,
        },
        select: {
            id: true,
            status: true,
            date_delivered: true,
        }
    });

    //analytics map
    const analyticsMap = new Map<string, number>();

    for (const order of totalDeliveries) {
        const status = order.status ?? 'unknown';
        analyticsMap.set(status, (analyticsMap.get(status) ?? 0) + 1);
    }

    return {
        [OrderStatus.ASSIGNED]: totalDeliveries.length ?? 0,
        [OrderStatus.DELIVERED]: analyticsMap.get(OrderStatus.DELIVERED) ?? 0,
        [OrderStatus.FAILED]: analyticsMap.get(OrderStatus.FAILED) ?? 0,
    }
}
