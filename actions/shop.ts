'use server'

import { getServerSessionContext } from "@/lib/checkServerAuth";
import Shop from "@/models/shopModel";
import { revalidatePath } from "next/cache";

interface UpdateData {
    name?: string;
    accessToken?: string;
    platform?: string;
}

export async function updateShop(domain: string, data: UpdateData) {
    if (!domain || !data) {
        return { success: false, message: "Domain or updated data is missing." };
    }

    try {
        const { role } = await getServerSessionContext();

        if (role !== 'merchant') {
            return { success: false, message: "Unauthorized. Only admin can update shops." };
        }

        //find the shop by domain and update the name
        const result = await Shop.findOneAndUpdate({ domain }, { $set: data });

        if (!result) {
            return { success: false, message: "Update Shop failed. No shop found with the provided domain." };
        }

        return { success: true, message: "Shop updated successfully." };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("Error updating shop:", error.message);
        return { success: false, message: error.message };
    }
}

export async function getShops() {
    try {
        const { role, merchantId } = await getServerSessionContext();

        if (role === 'driver') {
            console.log("Driver role detected. No shops to fetch.");
            return [];
        }

        // Fetch shops associated with the user
        const shops = await Shop.find({ owner: merchantId });

        if (shops.length === 0) {
            console.log("No shops found for the user.");
            return [];
        }

        //format shops for removing unnecessary fields
        const formattedShops = shops.map(shop => ({
            domain: shop.domain,
            platform: shop.platform,
            name: shop.name
        }))

        return formattedShops;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching shops:", error.message);
        return [];
    }
}

export async function deleteShop(domain: string) {
    if (!domain) {
        return { success: false, message: "Domain is required to delete the shop." };
    }

    try {
        const { role } = await getServerSessionContext();

        if (role !== 'merchant') {
            return { success: false, message: "Unauthorized. Only admin can delete shops." };
        }

        const result = await Shop.findOneAndDelete({ domain });

        if (!result) {
            return { success: false, message: "Delete Shop failed. No shop found with the provided domain." };
        }

        revalidatePath('/stores');

        return { success: true, message: "Shop deleted successfully." };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting shop:", error.message);
        return { success: false, message: error.message };
    }
}