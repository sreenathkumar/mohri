import prisma, { OrderStatus } from "@/lib/prisma";

export interface ManagerPerformanceParams {
    organizationId: string;
    userId: string;
    preset?: 'last7' | 'last30' | 'last90';
}

/**
 * Fetch manager performance metrics
 */
export async function fetchManagerPerformanceMetrics({ organizationId, userId, preset }: ManagerPerformanceParams) {
    if (!organizationId || !userId) throw new Error('organizationId and userId are required');

    const performanceMetrics = await Promise.all([
        prisma.order.aggregate({
            where: {
                shop: { organizationId },
                status: OrderStatus.DELIVERED,
                reconciledById: userId,
            },
            _sum: {
                amount: true
            },
            _count: {
                id: true
            }
        }),

    ]);

    return {
        cashReconciled: performanceMetrics[0]._sum.amount || 0,
        orderHandled: performanceMetrics[0]._count.id || 0
    };
}
