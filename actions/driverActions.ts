
'use server'

import { getServerSessionContext } from "@/lib/checkServerAuth";
import { fetchDriverOrders, mutateDeliveryStatus } from "@/services/driver";
import { OrderStatus } from "@/types/OrderType";
import { revalidatePath } from "next/cache";



export async function getDriverTasks() {
    try {
        const { role, userId } = await getServerSessionContext();

        if (role !== 'driver') {
            throw new Error('Unauthorized access: Only drivers can access this resource.');
        }

        //fetch driver tasks from the database
        const tasks = await fetchDriverOrders(userId);

        return tasks;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in getting driver tasks: ', error.message);
        return []
    }
}

type DriverDeliveryStatus = OrderStatus.DELIVERED | OrderStatus.OUT_FOR_DELIVERY | OrderStatus.FAILED

export async function updateDeliveryStatus({ order_id, status }: { order_id: number, status: DriverDeliveryStatus }) {
    try {
        const { role, userId } = await getServerSessionContext();

        if (role !== 'driver') {
            throw new Error('Unauthorized access: Only drivers can update delivery status.');
        }

        //update delivery status in the database
        const updatedOrder = await mutateDeliveryStatus({ order_id, status, userId });

        revalidatePath('/driver/dashboard');

        if (!updatedOrder) {
            throw new Error('Failed to update delivery status.');
        }

        return {
            success: true,
            message: 'Delivery status updated successfully',
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in updating delivery status: ', error.message);
        return {
            success: false,
            message: error.message || 'An error occurred while updating delivery status',
        }
    }
}