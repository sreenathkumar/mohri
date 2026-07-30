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
export async function getMerchantMapData({ organizationId }: FetchMerchantMapParams) {
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
        return { ok: false, message: "Missing required parameters" };
    }

    const numericOrderId = typeof orderId === "string" ? parseInt(orderId, 10) : orderId;

    if (isNaN(numericOrderId)) {
        return { ok: false, message: "Invalid order ID format" };
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
        return { ok: false, message: "Order not found" };
    }

    //Perform location update
    await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
            latitude,
            longitude,
        },
    });

    return { ok: true, message: "Order coordinates updated successfully" };
}