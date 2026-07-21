'use server'

import { getServerSessionContext } from "@/lib/checkServerAuth";
import { FormState, updateOrderCoordinateSchema } from "@/lib/zod";
import { changeOrderLocation, fetchMerchantMapData } from "@/services/map";
import { MapPageOrderType } from "@/types/OrderType";
import { revalidatePath } from "next/cache";


export async function getMarchantMapData() {
    try {
        const { role, merchantId } = await getServerSessionContext();

        if (role !== 'merchant' || !merchantId) {
            throw new Error('Unauthorized access. Only merchants can access this data.');
        }

        // Fetch the merchant map data using the merchantId
        const merchantMapData = await fetchMerchantMapData({ merchantId });

        return merchantMapData.map(order => ({
            id: order.order_id.toString() as string,
            status: order.status as 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'PROCESSING',
            latitude: order.latitude as number,
            longitude: order.longitude as number,
            address: order.address as string,
            assignee: {
                id: order.asignee?._id?.toString() as string,
                name: order.asignee?.name as string
            }
        })) as MapPageOrderType[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error in getMerchantMapData: ', error.message);
        return [];
    }
}



export async function updateOrderCoordinates(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = updateOrderCoordinateSchema.safeParse({
        orderId: formData.get('orderId') as string,
        latitude: formData.get('latitude') as string,
        longitude: formData.get('longitude') as string
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation failed. Please check the input values.',
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    const { orderId, latitude, longitude } = validatedFields.data;

    if (!orderId || latitude === undefined || longitude === undefined) {
        return {
            success: false,
            message: 'Invalid input. Order ID, latitude, and longitude are required.'
        };
    }

    try {
        const { role, merchantId } = await getServerSessionContext();

        if (role !== 'merchant' || !merchantId) {
            throw new Error('Unauthorized access. Only merchants can update order coordinates.');
        }

        // Call the service to update the order coordinates
        const updateResult = await changeOrderLocation({ orderId, latitude, longitude });

        if (!updateResult.ok) {
            throw new Error(updateResult.message || 'Failed to update order coordinates.');
        }

        revalidatePath(`/merchant/track`);

        return {
            success: true,
            message: 'Order coordinates updated successfully.'
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error in updateOrderCoordinates: ', error.message);
        return {
            success: false,
            message: error.message || 'An unexpected error occurred while updating order coordinates.'
        }
    }
}