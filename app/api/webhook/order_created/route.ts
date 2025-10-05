// function which push the new order data to the DB whenever new order is placed in woocommerce
// also revalidate the path to show the updated data

import { prepareOrder } from "@/actions/woocommerce/wooConfig";
import dbConnect from "@/dbConnect";
import verifySignature from "@/lib/verifyWebhook";
import { orderSchema } from "@/lib/zod";
import Order from "@/models/orderModel";
import { OrderType } from "@/types/OrderType";


export async function POST(request: Request) {
    try {
        const isAuthenticated = await verifySignature(request, process.env.OC_WC_WEBHOOK);

        if (!isAuthenticated) {
            console.error('Webhook authentication failed');
            return new Response('Webhook unauthenticated', {
                status: 200,
            })
        }

        const res = await request.json();

        if (res) {
            //validate the order data
            const { error } = orderSchema.safeParse(res);

            if (error) {
                console.error('Order validation error:', error.errors);
                return new Response('Invalid order data', {
                    status: 200,
                })
            }
            const order: OrderType | null = prepareOrder(res);

            if (!order) {
                return new Response('Order not created', {
                    status: 200,
                })
            }


            //connect to the database
            await dbConnect();

            //check if the order already exists in the database
            const existingOrder = await Order.findOne({ order_id: order.order_id });
            if (existingOrder) {
                return new Response('Order already exists', {
                    status: 200,
                })
            }

            //create a new order document in the database
            const newOrder = new Order(order);
            await newOrder.save();

            // //extract the address and city from the order
            // const { address, city } = order;

            // //check if the lat and lon are already present for this address
            // const existingCity = await Location.findOne({
            //     city: city.toLocaleLowerCase()
            // });

            // //city exists but block does not exist
            // if (existingCity && !existingCity.blocks.has(`block_${address.block}`)) {
            //     console.log(`block ${address.block} not exist in city ${city}.`);

            //     //get the coordinates for the address
            //     const coordinates = await getLocation({ city, block: address.block });

            //     // Set the coordinates if available
            //     if (coordinates?.lat && coordinates?.lon) {
            //         //add the new block with coordinates to the existing city
            //         existingCity.blocks.set(`block_${address.block}`, {
            //             lat: coordinates.lat,
            //             lon: coordinates.lon,
            //         });
            //     }
            // } else if (!existingCity) {
            //     console.log(`City ${city} does not exist. Creating a new city.`);

            //     //get the coordinates for the address
            //     const coordinates = await getLocation({ city, block: address.block });

            //     if (coordinates?.lat && coordinates?.lon) {
            //         //create a new city document with the block and coordinates
            //         const newLocation = new Location({
            //             city: city.toLocaleLowerCase(),
            //             blocks: {
            //                 [`block_${address.block}`]: {
            //                     lat: coordinates.lat,
            //                     lon: coordinates.lon,
            //                 },
            //             },
            //         });

            //         await newLocation.save();
            //     } else {
            //         console.error('Coordinates not found for the new city:', city);
            //     }
            // }

            // Notify clients about the new order
            await fetch(`${process.env.BASE_URL}/api/webhook/updates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "NEW_ORDER", order }),
            })

            return new Response('Success!', {
                status: 200,
            })
        } else {
            return new Response('Error in order_created webhook. Nothing getting from webhook.', {
                status: 400,
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Something error in order_created webhook: ', error.message);
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
}


