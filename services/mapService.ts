import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export interface FetchMerchantMapParams {
    organizationId: string;
}

export interface ChangeOrderLocationParams {
    orderId: number | string;
    latitude: number;
    longitude: number;
    organizationId: string;
}

/**
 * Fetch non-delivered/non-cancelled orders with coordinates for map display
 */
export async function fetchMerchantMapData({ organizationId }: FetchMerchantMapParams) {
    if (!organizationId) return [];

    const orders = await prisma.order.findMany({
        where: {
            organizationId,
            status: {
                notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
            },
        },
        select: {
            order_id: true,
            city: true,
            address: true,
            status: true,
            latitude: true,
            longitude: true,
            assignee: {
                select: {
                    name: true,
                },
            },
        },
    });

    return orders
}

/**
 * Update latitude and longitude coordinates for a specific order
 */
export async function updateOrderLocation({
    orderId,
    latitude,
    longitude,
    organizationId,
}: ChangeOrderLocationParams) {
    if (!orderId || !organizationId) {
        throw new Error("[updateOrderLocation] Missing required parameters: orderId and organizationId are required");
    }

    const numericOrderId = typeof orderId === "string" ? parseInt(orderId, 10) : orderId;

    if (isNaN(numericOrderId)) {
        throw new Error("[updateOrderLocation] Invalid orderId: must be a number or numeric string");
    }

    // Check if the order exists and belongs to the organization
    const existingOrder = await prisma.order.findFirst({
        where: {
            order_id: numericOrderId,
            organizationId,
        },
        select: { id: true },
    });

    if (!existingOrder) {
        throw new Error("[updateOrderLocation] Order not found or does not belong to the organization");
    }

    //Perform location update
    await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
            latitude,
            longitude,
        },
    });

}