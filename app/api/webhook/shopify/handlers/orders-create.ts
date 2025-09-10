'use server'

import dbConnect from "@/dbConnect";
import { normalizeShopifyResponse } from "@/lib/utils";
import Order from "@/models/orderModel";
import Shop from "@/models/shopModel";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleOrderCreate(data: any, domain: string | null) {
    if (!data) {
        throw new Error("No data provided to handleOrderCreate");
    }

    if (!domain) {
        throw new Error("No domain provided to handleOrderCreate");
    }

    //normalize the webhook response body to the required format
    const normalData = normalizeShopifyResponse(data);

    if (!normalData) {
        throw new Error("Failed to normalize data in handleOrderCreate");
    }
    try {

        await dbConnect();

        //get the shop id and it's user
        const shopInfo = await Shop.findOne({ domain, accessToken: { $exists: true } });

        if (!shopInfo) {
            throw new Error(`Shop with domain ${domain} is not found in handleOrderCreate`);
        }

        //save the order data in the database
        await Order.create({
            ...normalData,
            status: 'porcessing',
            asignee: null,
            shop: shopInfo.domain,
            user_id: shopInfo.user
        });

        revalidatePath('/orders')
    } catch (err) {
        console.error("Error in handleOrderCreate:", err);
        throw err;
    }
}

export default handleOrderCreate;
