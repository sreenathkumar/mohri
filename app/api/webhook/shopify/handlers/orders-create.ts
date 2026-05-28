'use server'

import Order from "@/models/orderModel";
import Shop from "@/models/shopModel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveOrderToDB(data: any, domain: string | null) {
    if (!data) {
        throw new Error("No data provided to saveOrderToDB");
    }

    if (!domain) {
        throw new Error("No domain provided to saveOrderToDB");
    }

    try {
        //get the shop id and it's user
        const shopInfo = await Shop.findOne({ domain});

        if (!shopInfo) {
            throw new Error(`Shop with domain ${domain} is not found in connected stores.`);
        }

        //save the order data in the database
        await Order.create({
            ...data,
            status: 'porcessing',
            asignee: null,
            shop: shopInfo.domain,
            user_id: shopInfo.user
        });

        await fetch(`${process.env.AUTH_URL}/api/webhook/updates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "NEW_ORDER", order: data }),
            }).then(()=>console.log('update in frontend done.')).catch(err=> console.log('updatig frontend failed. Error is: ', err.message))
    } catch (err) {
        console.error("Error in saveOrderToDB:", err);
        throw err;
    }
}

export default saveOrderToDB;
