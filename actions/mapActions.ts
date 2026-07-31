'use server'

import { getRequiredSessionContext } from "@/lib/auth-context";
import { FormState, updateOrderCoordinateSchema } from "@/lib/zod";
import { fetchOwnerMapData, updateOrderLocation } from "@/services/mapService";
import { MapPageOrderType } from "@/types/OrderType";
import { revalidatePath } from "next/cache";

/**
 * Fetch merchant map data for the current session's organization
 * @returns orders data with longitude and latitude
 */
export async function getOwnerMapData() {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager']
        })

        // Fetch the merchant map data using the organizationId 
        const ownerMapData = await fetchOwnerMapData({ organizationId });

        const allowedStatuses: MapPageOrderType['status'][] = ['PROCESSING', 'ASSIGNED', 'OUT_FOR_DELIVERY'];

        const formattedData: MapPageOrderType[] = ownerMapData
            .filter(order => allowedStatuses.includes(order.status as MapPageOrderType['status']))
            .map(order => ({
                id: order.order_id,
                name: order.name,
                city: order.city,
                address: order.address,
                status: order.status as MapPageOrderType['status'],
                latitude: order.latitude,
                longitude: order.longitude,
                assignee: order.assignee ? {
                    id: order.assignee.id,
                    name: order.assignee.name
                } : null
            }));

        return formattedData;

    } catch (error: any) {
        console.error('[getMerchantMapData] Error in getMerchantMapData: ', error.message);
        return [];
    }
}

/**
 * 
 * @param prevState previous state of the update form
 * @param formData latitud and longitude
 * @returns succ
 */

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
        throw new Error('Missing required parameters: orderId, latitude, or longitude.');
    }

    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager']
        });

        // Call the service to update the order coordinates
        await updateOrderLocation({ organizationId, orderId, latitude, longitude });
        revalidatePath(`/merchant/track`);

        return {
            success: true,
            message: 'Order coordinates updated successfully.'
        };
    } catch (error: any) {
        console.error('[updateOrderCoordinates] Error in updateOrderCoordinates: ', error.message);
        return {
            success: false,
            message: error.message || 'An unexpected error occurred while updating order coordinates.'
        }
    }
}