import { Prisma, prisma } from "@/lib/prisma";
import { OrderStatus } from '@lib/prisma';

export interface FetchDriverOrdersParams {
    driverId: string;
    organizationId: string;
    filter?: Prisma.OrderScalarWhereInput
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
export async function fetchDriverOrders({ driverId, organizationId, filter }: FetchDriverOrdersParams) {
    if (!driverId || !organizationId) return [];

    return await prisma.order.findMany({
        where: {
            assigneeId: driverId,
            organizationId,
            ...filter
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
export async function changeDeliveryStatus({
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


/**
 * update driver dashboard information
 */
interface UpdateDriverInfoParams {
    driverId: string;
    organizationId: string;
    info: {
        name?: string;
        phone?: string;
        address?: string;
    };
}
export async function updateDriverInfo({ driverId, organizationId, info }: UpdateDriverInfoParams) {
    if (!driverId || !organizationId) {
        throw new Error('Missing required parameters: driverId and organizationId are required.');
    }

    const updatedDriver = await prisma.user.update({
        where: {
            id: driverId,
        },
        data: {
            name: info.name?.trim() || undefined,
            phone: info.phone?.trim() || undefined,
            address: info.address?.trim() || undefined,
        },
    });

    return updatedDriver;
}