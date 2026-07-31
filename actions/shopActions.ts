'use server'

import { getRequiredSessionContext } from "@/lib/auth-context";
import Shop from "@/models/shopModel";
import { fetchShops, mutateShop, UpdateShopInput } from "@/services/shopService";
import { revalidatePath } from "next/cache";

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[updateShop] Error updating shop:", error.message);
        return { success: false, message: error.message };
    }
}


/**
 *  Delete a shop scoped to an organization
 * @param domain domain of the shop that need to be deleted.
 * @returns success status and message
 */
export async function deleteShop(domain: string) {
    if (!domain) {
        return { success: false, message: "Domain is required to delete the shop." };
    }

    try {
        await getRequiredSessionContext({
            allowedRoles: ["owner",],
        });

        const result = await Shop.findOneAndDelete({ domain });

        if (!result) {
            return { success: false, message: "Delete Shop failed. No shop found with the provided domain." };
        }

        revalidatePath('/stores');

        return { success: true, message: "Shop deleted successfully." };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[deleteShop] Error deleting shop:", error.message);
        return { success: false, message: error.message };
    }
}