'use server'

import dbConnect from "@/dbConnect";
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
        //connect to the database
        await dbConnect();

        //find the shop by domain and update the name
        const result = await Shop.findOneAndUpdate({ domain }, { $set: data });

        if (!result) {
            return { success: false, message: "Update Shop failed. No shop found with the provided domain." };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("Error updating shop:", error.message);
        return { success: false, message: error.message };
    }

    return { success: true, message: "Shop updated successfully." };
}

export async function getShops(user: string) {
    if (!user) {
        console.log("User Id is required to get the connected shops.");
        return [];
    }

    try {
        await dbConnect();

        // Fetch shops associated with the user
        const shops = await Shop.find({ user });

        if (shops.length === 0) {
            console.log("No shops found for the user.");
            return [];
        }

        return shops;

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
        await dbConnect();

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