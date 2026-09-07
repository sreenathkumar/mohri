import verifyWebhook from "@/lib/verifyWebhook";
import { NextRequest } from "next/server";
import prisma, { OrderStatus } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        //verify the webhook
        const { valid, topic, shopDomain, data: orderData } = await verifyWebhook(req);

        if (!valid || !topic || !shopDomain || !orderData) {
            console.error('Webhook verification failed or missing data:', { valid, topic, shopDomain, orderData });
            return new Response("Invalid webhook", { status: 400 });
        }

        // check if the shop is registered in your database
        const existingShop = await prisma.shop.findFirst({
            where: {
                domain: shopDomain
            },
            select: {
                id: true,
                domain: true,
            }
        })

        if (!existingShop) {
            console.error(`Shop: ${shopDomain} is not connected.`);
            return new Response("Shop not found", { status: 404 });
        }

        //handle the webhook data based on the topic
        switch (topic) {
            case 'ORDERS_CREATE':
                //save the order data in the database
                try {
                    await prisma.order.create({
                        data: {
                            ...orderData,
                            status: OrderStatus.PROCESSING,
                            shopId: existingShop.id,
                            shopDomain: existingShop.domain,
                        }
                    })

                } catch (error: any) {
                    throw new Error(`Failed to save order. Reason: ${error.message}`);
                }
                break;
            case 'ORDERS_PAID':
                console.log('Order Paid:', orderData);
                break;
            case 'ORDERS_DELETE':
                console.log('Order Deleted:', orderData);
                break;
            case 'ORDERS_CANCELLED':
                console.log('Order Cancelled:', orderData);
                break;
            default:
                console.log(`Unknown topic: ${topic}`);
                return new Response("Unknown topic", { status: 400 });
        }

        return new Response(`${topic} handled successfully.`, { status: 200 });

    } catch (error: any) {
        console.error("Error handling webhook:", error.message);
        return new Response(`Error handling webhook: ${error.message}`, { status: 500 });
    }

}
