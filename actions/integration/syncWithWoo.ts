'use server'

import dbConnect from "@/dbConnect";
import SyncTime from "@/models/syncTimeModel";
import { prepareOrder, wooApi } from "./wooConfig";
import { OrderType } from "@/types/OrderType";
import Order from "@/models/orderModel";

interface FetchFilterType {
    status?: string,
    per_page?: number,
    page?: number,
    after?: string
}

async function syncWithWoo() {
    try {
        await dbConnect();

        //get last sync time from the database
        const res = await SyncTime.findOne({ doc: 'orders' }).select('lastSyncedAt');

        const lastSynced = res?.lastSyncedAt;

        console.log('last synced: ', lastSynced);

        if (!lastSynced) return { status: 'error', message: 'No last sync time found' };

        //fetch orders using the time from woocomerce, store the time when request is made/completed
        const fetchedOrders = await fetchOrders({ status: 'processing', after: lastSynced });
        const newLastSynced = new Date();

        if (fetchedOrders.length === 0) return { status: 'error', message: 'No orders found' };

        // Extract fetched product IDs
        const fetchedOrderIds = fetchedOrders.map((order) => order.order_id);

        // Query database for existing products
        const existingOrders = await Order.find({ order_id: { $in: fetchedOrderIds } }).select('-_id order_id');

        const existingOrderIds = existingOrders.map((order) => order.order_id);

        // Filter non-existing products
        const notAddedOrders = fetchedOrders.filter(
            (order) => !existingOrderIds.includes(order.order_id)
        );

        if (notAddedOrders.length === 0) {
            return { status: 'error', message: 'No new orders to insert.' }
        }

        // Insert non-existing products into the database
        await Order.insertMany(notAddedOrders);

        // Update the last synced time in the database
        await SyncTime.findOneAndUpdate({ doc: 'orders' }, { lastSyncedAt: newLastSynced });

        return {
            status: 'success',
            message: 'Orders synced successfully'
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error.message);

        return {
            status: 'error',
            message: 'Error in syncing orders'
        }
    }

}


export const fetchOrders: (filters: FetchFilterType) => Promise<OrderType[]> = async (filters: FetchFilterType) => {
    try {
        const res = await wooApi.get('orders', { ...filters });
        const totalPages = parseInt(res.headers['x-wp-totalpages'], 10);

        // Format the first page of data
        const formatedOrder = res.data.map((order: unknown) => prepareOrder(order));

        // If there is only one page, return the formatted data
        if (totalPages === 1) return formatedOrder;

        // Create an array of promises for all pages
        const requests = Array.from({ length: totalPages - 1 }, (_, index) =>
            wooApi.get('orders', { ...filters, page: index + 2 })
        );

        // Resolve all promises in parallel
        const responses = await Promise.all(requests);

        // Combine all orders from all pages
        const allOrders = [
            ...formatedOrder,
            ...responses.flatMap((res) => res.data.map((order: unknown) => prepareOrder(order)))
        ];

        return allOrders;
    } catch (error) {
        console.log(error);
        return [];
    }
};


export default syncWithWoo