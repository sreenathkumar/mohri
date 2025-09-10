import Shop from "@/models/shopModel";
import { verifyWebhook } from "@/shopify.config";
import { NextRequest } from "next/server";
import handleOrderCreate from "./handlers/orders-create";
import dbConnect from "@/dbConnect";

export async function POST(req: NextRequest) {
    //verify the webhook
    const { valid, topic, domain, data } = await verifyWebhook(req);

    if (!valid) {
        console.error('Invalid webhook call, not handling it');
        return new Response("Invalid webhook", { status: 400 });
    }

    console.log(`Received valid webhook for topic: ${topic} from shop: ${domain}`);
    try {
        await dbConnect();
        // check if the shop is registered in your database
        const result = await Shop.findOne({ domain: domain, accessToken: { $exists: true } });

        if (!result) {
            console.error(`Shop: ${domain} is not connected.`);
            return new Response("Shop not found", { status: 404 });
        }

        //handle the webhook data based on the topic
        switch (topic) {
            case 'ORDERS_CREATE':
                //call the order create handler
                await handleOrderCreate(data, domain);
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
