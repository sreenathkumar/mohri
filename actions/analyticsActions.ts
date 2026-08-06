'use server'

import { getRequiredSessionContext } from "@/lib/auth-context";
import { fetchDashOverviewMetrics, fetchOrderBarChartData, } from "@/services/analytics";
import { OrderStatus } from "@lib/prisma";


export interface ReportDateParams {
    localFrom?: string;
    localTo?: string;
    organizationId: string;
}

/**
 * Get the daily overview for dashboard page.
 */
export async function getDashOverviewStat() {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager'],
        })
        const overviewMetrics = await fetchDashOverviewMetrics({ organizationId });
        const orgainizedData = {
            ordersToday: overviewMetrics.statusGroups?.find((group => group.status === OrderStatus.PROCESSING))?._count?._all || 0,
            pendingAssignment: overviewMetrics.pendingAssignment || 0,
            outForDelivery: overviewMetrics.statusGroups?.find((group => group.status === OrderStatus.OUT_FOR_DELIVERY))?._count?._all || 0,
            deliveredToday: overviewMetrics.statusGroups?.find((group => group.status === OrderStatus.DELIVERED))?._count?._all || 0,
            cashCollected: overviewMetrics.cashCollected || 0,
        }
        return orgainizedData;
    } catch (error: any) {
        console.error('[getDashOverviewStat] Error fetching overview metrics:', error?.message);
        return {
            ordersToday: 0,
            pendingAssignment: 0,
            outForDelivery: 0,
            deliveredToday: 0,
            cashCollected: 0,
        };
    }
}


/**
 * Get the order placed, delivered, and failed bar chart data for the dashboard with preset of last 7, 30 or 90 days.
 * @param preset last 7 days, last 30 days or last 90 days.
 * @returns array of {processing, delivered and failed} orders with the bucket dates (with 0 if empty) 
 */
export async function getDashboarBarchartData(preset: 'last7' | 'last30' | 'last90') {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager'],
        })
        const barchartData = await fetchOrderBarChartData({ organizationId, preset });

        return barchartData;
    } catch (error: any) {
        console.error('[getDashboarBarchartData] Error fetching barchart data:', error?.message);
        return [];
    }
}