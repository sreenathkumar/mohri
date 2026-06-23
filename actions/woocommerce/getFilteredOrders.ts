"use server";

import { getServerSessionContext } from "@/lib/checkServerAuth";
import Order from "@/models/orderModel";
import Shop from "@/models/shopModel";
import { OrderType } from "@/types/OrderType";
import { SortOrder } from "mongoose";

interface SearchParams {
    query?: string | string[];
    skip?: number;
    limit?: number;
    page?: number;
    sort?: Record<string, SortOrder>
}

async function getFilteredOrders(params: SearchParams) {
    const { query = '', skip = 0, limit = 10, page = 1, sort } = params;
    const numQuery = Number(query);
    const isNumber = !isNaN(numQuery);

    try {
        const { merchantId, userId, role } = await getServerSessionContext();
        let searchCriteria = undefined;

        if (role === 'driver') {
            searchCriteria = {
                asignee: userId,
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { phone: { $regex: query, $options: 'i' } },
                    { city: { $regex: query, $options: 'i' } },
                    { asignee_name: { $regex: query, $options: 'i' } },
                    ...(isNumber ? [{ order_id: numQuery }] : [])
                ],
            };
        } else {
            //get all the connected shop ids
            const connectedShops = await Shop.distinct('_id', { ownerId: merchantId });;

            //prepare the search criteria to fetch orders for the connected shops
            searchCriteria = {
                shopId: { $in: connectedShops },
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { phone: { $regex: query, $options: 'i' } },
                    { city: { $regex: query, $options: 'i' } },
                    { asignee_name: { $regex: query, $options: 'i' } },
                    ...(isNumber ? [{ order_id: numQuery }] : [])
                ],
            };
        }

        //check if the searchCriteria is empty, if yes then return empty orders
        if (!searchCriteria) {
            console.log('No search criteria found for the user. Returning empty orders.');
            return { orders: [], totalPages: 0, totalCount: 0, currentPage: page };
        }

        // Fetch filtered orders and total count in parallel
        const [ordersResult, totalCount] = await Promise.all([
            Order.find(searchCriteria)
                .select('-_id -__v -createdAt -updatedAt -date_created_gmt -date_modified_gmt')
                .populate('asignee', ['name', 'image'])
                .limit(limit)
                .skip(skip)
                .sort(sort)
                .lean(),

            Order.countDocuments(searchCriteria),
        ]);

        // Format response
        const orders: OrderType[] = ordersResult.map((item) => ({
            order_id: item.order_id,
            name: item.name,
            city: item.city,
            address: item.address,
            phone: item.phone,
            payment: item.payment,
            amount: item.amount,
            status: item.status,
            asignee: {
                id: item.asignee?._id.toString(),
                name: item.asignee?.name,
                image: item.asignee?.image
            }
        }));

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        return {
            orders,
            totalPages,
            totalCount,
            currentPage: page
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error in getFilteredOrders:', error?.message);
        return {
            orders: [],
            totalPages: 0,
            totalCount: 0,
            currentPage: page
        };
    }
}

export default getFilteredOrders;
