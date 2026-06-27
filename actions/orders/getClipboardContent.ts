'use server'

import dbConnect from "@/dbConnect";
import Order from "@/models/orderModel";

interface OrderType {
    order_id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    payment: string;
    amount: string;
    status: string;
}

export async function getClipboardContent(selectedOrders: number[]) {
    if (selectedOrders.length <= 0) {
        return null
    }

    try {
        await dbConnect();
        const orders = await Order.find({ order_id: { $in: selectedOrders } }).select(['order_id', 'name', 'city', 'address', 'phone', 'payment', 'amount', 'status']);

        if (orders.length <= 0) {
            return null
        }

        const text = orders.map(order => generateText(order)).join('\n');

        return text;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in getClipboardContent: ', error.message);
        return null;
    }
}

function generateText(order: OrderType) {
    return `Order Number: #${order.order_id}
Name: ${order.name}
City: ${order.city}
Address: ${order.address}
Phone: ${order.phone}
Payment: ${order.payment === 'hesabe' ? 'PAID' : 'Cash On Delivery'}
Amount: ${order.amount === 'hesabe' ? 'N/A' : order.amount}
Status: ${order.status}

`
}
