import Shop from "@/models/shopModel";
import { verifyWebhook } from "@/shopify.config";
import { NextRequest } from "next/server";
import dbConnect from "@/dbConnect";
import saveOrderToDB from "./handlers/orders-create";

export async function POST(req: NextRequest) {
    try {
    //verify the webhook
    const { valid, topic, shop, data } = await verifyWebhook(req);

    if (!valid) {
        console.error('Invalid webhook call, not handling it');
        return new Response("Invalid webhook", { status: 400 });
    }

         await dbConnect();
         // check if the shop is registered in your database
         const result = await Shop.findOne({ domain: shop});

        if (!result) {
            console.error(`Shop: ${shop} is not connected.`);
            return new Response("Shop not found", { status: 404 });
        }

        //handle the webhook data based on the topic
        switch (topic) {
            case 'ORDERS_CREATE':
                //call the order create handler
                await saveOrderToDB(data, shop);
                break;
            case 'ORDERS_PAID':
                console.log('Order Paid:', data);
                break;
            case 'ORDERS_DELETE':
                console.log('Order Deleted:', data);
                break;
            case 'ORDERS_CANCELLED':
                console.log('Order Cancelled:', data);
                break;
            default:
                console.log(`Unknown topic: ${topic}`);
                return new Response("Unknown topic", { status: 400 });
        }

        return new Response(`${topic} handled successfully.`, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error handling webhook:", error.message);
        return new Response(`Error handling webhook: ${error.message}`, { status: 500 });
    }

}
