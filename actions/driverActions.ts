
'use server'

import { getRequiredSessionContext } from "@/lib/auth-context";
import { changeDeliveryStatus, fetchDriverOrders } from "@/services/driverService";
import { OrderStatus } from "@lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fetches the tasks (orders) assigned to the currently logged-in driver.
 * @returns array of orders for the current driver
 */

export async function getDriverTasks() {
    try {
        const { organizationId, userId } = await getRequiredSessionContext({
            allowedRoles: ['driver'],
        });

        //fetch driver tasks from the database
        const tasks = await fetchDriverOrders({ organizationId, driverId: userId });

        return tasks;

    } catch (error: any) {
        console.error('[getDriverTasks] error in getting driver tasks: ', error?.message);
        return []
    }
}

/**
 * Updates the delivery status of a specific order for the currently logged-in driver.
 * @param order_id id of the order that status will be updated
 * @param status status to be updated for the order (e.g., 'PENDING', 'IN_PROGRESS', 'DELIVERED')
 * @returns status, message object
 */
interface UpdateDeliveryStatusParams {
    orderId: number;
    status: Extract<OrderStatus, 'OUT_FOR_DELIVERY' | 'FAILED' | 'DELIVERED'>;
}

export async function updateDeliveryStatus({ orderId, status }: UpdateDeliveryStatusParams) {
    if (!orderId || !status) {
        throw new Error('Missing required parameters: orderId and status are required.');
    }

    try {
        const { organizationId, userId } = await getRequiredSessionContext({
            allowedRoles: ['driver'],
        })

        //update delivery status in the database
        await changeDeliveryStatus({ orderId, userId, organizationId, status });

        revalidatePath('/driver/dashboard');

        return {
            success: true,
            message: 'Delivery status updated successfully',
        };

    } catch (error: any) {
        console.error('[updateDeliveryStatus] error in updating delivery status: ', error?.message);
        return {
            success: false,
            message: error.message || 'An error occurred while updating delivery status',
        }
    }
}