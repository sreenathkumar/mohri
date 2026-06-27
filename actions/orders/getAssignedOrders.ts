'use server'

import dbConnect from "@/dbConnect";
import Order from "@/models/orderModel";
import { unstable_cache } from "next/cache";

const getAssignedOrders = unstable_cache(async ({ id, status }: { id: string, status?: string }) => {

    if (!id) {
        return []
    }

    try {
        dbConnect();

        const filter = { asignee: id, ...(status ? { status: (status !== 'processing' ? { $ne: 'processing' } : 'processing') } : {}) };

        let projection;

        if (status === 'processing') {
            // Include all fields
            projection = {
                order_id: 1,
                name: 1,
                city: 1,
                address: 1,
                phone: 1,
                payment: 1,
                amount: 1,
                status: 1,
                date_delivered: 1,
                _id: 0,
            };
        } else {
            // Include only selected fields and exclude others entirely
            projection = {
                order_id: 1,
                payment: 1,
                amount: 1,
                status: 1,
                date_delivered: 1,
                _id: 0,
            };
        }

        const orders = await Order.find(filter).select(projection).lean();

        if (orders.length <= 0) {
            return []
        }

        // Convert the orders to a more readable format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedOrders = orders.map((order: any) => {
            return {
                order_id: order.order_id,
                name: order.name,
                city: order.city,
                address: order.address,
                phone: order.phone,
                payment: order.payment,
                amount: order.amount,
                status: order.status,
                date_delivered: order.date_delivered,
            }
        });

        return formattedOrders

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in getAssignedOrders: ', error?.message);

        return []
    }
}, ['id', 'status'], { tags: ['assignedOrders'], revalidate: 3600 })

export { getAssignedOrders }