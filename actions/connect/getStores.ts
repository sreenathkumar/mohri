'use server'

import dbConnect from "@/dbConnect"
import Shop from "@/models/shopModel";

const getShops = async (user: string) => {
    if (!user) {
        console.log("User Id is required to get the connected shops.");
        return [];
    }

    try {
        await dbConnect();

        // Fetch shops associated with the user
        const shops = await Shop.find({});

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

export default getShops