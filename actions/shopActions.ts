'use server'

import { getRequiredSessionContext } from "@/lib/auth-context";
import { fetchShops, mutateShop, UpdateShopInput } from "@/services/shopService";

/**
 * get all the shops under the user active organization
 * @returns  list of shops
 */
export async function getShops() {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        return await fetchShops({ organizationId });
    } catch (error: any) {
        console.error('[getShops] Error fetching shops: ', error.message);
        return [];
    }
}

/**
 * update a shop's details scoped to an organization
 * @param domain  domain of the shop to be updated
 * @param data    updated shop details
 * @returns       success status and message
 */
export async function updateShop(domain: string, data: UpdateShopInput) {
    if (!domain || !data) {
        throw new Error("Domain and data are required to update the shop.");
    }

    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        await mutateShop({ domain, organizationId, data });

        return { success: true, message: "Shop updated successfully." };

    } catch (error: any) {
        console.error("[updateShop] Error updating shop:", error.message);
        return { success: false, message: error.message };
    }
}
