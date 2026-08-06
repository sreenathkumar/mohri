import { OrderStatus, prisma } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export interface OverviewMetricsParams {
    localFrom?: string;
    localTo?: string;
    organizationId: string;
}
/**
 * Fetch dashboard overview metrics
 */
export async function fetchDashOverviewMetrics({ organizationId, localFrom, localTo }: OverviewMetricsParams) {
    if (!organizationId) return { totalOrders: 0, totalRevenue: 0 };

    //get the organization's timezone
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { timezone: true },
    });

    const baseDate = new Date();

    //Get local start (00:00:00.000) and end (23:59:59.999) of today
    const localFromDate = localFrom ? new Date(localFrom) : startOfDay(baseDate);
    const localToDate = localTo ? new Date(localTo) : endOfDay(baseDate);

    const businessTimezone = organization?.timezone || "Asia/Dhaka";

    const startUTC = fromZonedTime(localFromDate, businessTimezone);
    const endUTC = fromZonedTime(localToDate, businessTimezone);

    const from = new Date(startUTC.getTime());
    const to = new Date(endUTC.getTime());

    //Compute matching past duration limits to handle your historical comparison metrics
    const rangeDuration = to.getTime() - from.getTime();

    //Fire optimized database lookups concurrently using the resolved UTC dates
    const [statusGroups, pendingAssignment, cashCollected] = await Promise.all([
        prisma.order.groupBy({
            by: ['status'],
            where: {
                organizationId,
            },
            _count: { _all: true }
        }),

        prisma.order.count({
            where: {
                organizationId,
                status: OrderStatus.PROCESSING
            }
        }),

        prisma.order.aggregate({
            where: {
                organizationId,

                payment: "cod",
                status: OrderStatus.DELIVERED
            },
            _sum: {
                amount: true,
            }
        })
    ]);

    console.log('Status Groups:', statusGroups, pendingAssignment, cashCollected._sum.amount);

    return {
        statusGroups,
        pendingAssignment,
        cashCollected: cashCollected?._sum?.amount || 0,
    };
}