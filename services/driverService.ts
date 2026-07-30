import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export interface FetchDriverOrdersParams {
    driverId: string;
    organizationId: string;
}

export interface MutateDeliveryStatusParams {
    orderId: number;
    status: OrderStatus;
    userId: string;
    organizationId: string;
}

/**
 * Fetch all orders assigned to a specific driver within an organization
 */
export async function getDriverOrders({ driverId, organizationId }: FetchDriverOrdersParams) {
    if (!driverId || !organizationId) return [];

    return await prisma.order.findMany({
        where: {
            assigneeId: driverId,
            organizationId,
        },
        select: {
            order_id: true,
            name: true,
            city: true,
            address: true,
            phone: true,
            payment: true,
            amount: true,
            status: true,
            date_delivered: true,
            assignedAt: true,
        },
        orderBy: {
            date_created_gmt: "desc",
        },
    });
}

/**
 * Mutate an order's delivery status with active driver status management
 */
export async function updateDeliveryStatus({
    orderId,
    status,
    userId,
    organizationId,
}: MutateDeliveryStatusParams) {
    if (!orderId || !organizationId) return null;

    // update the incoming order's status
    const updatedOrder = await prisma.order.update({
        where: {
            organizationId,
            order_id: orderId,
        },
        data: {
            status,
            date_delivered: status === OrderStatus.DELIVERED ? new Date() : null,
        },
        select: {
            order_id: true,
            name: true,
            city: true,
            address: true,
            phone: true,
            payment: true,
            amount: true,
            status: true,
            date_delivered: true,
            assignedAt: true,
        },
    });

    // If update succeeded & action type is OUT_FOR_DELIVERY, revert other OUT_FOR_DELIVERY orders
    if (status === OrderStatus.OUT_FOR_DELIVERY) {
        await prisma.order.updateMany({
            where: {
                assigneeId: userId,
                organizationId,
                status: OrderStatus.OUT_FOR_DELIVERY,
                order_id: { not: orderId }, // Exclude target order
            },
            data: {
                status: OrderStatus.PROCESSING,
            },
        });
    }

    return updatedOrder;
}