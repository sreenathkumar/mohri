'use server'

import dbConnect from "@/dbConnect";
import Order from "@/models/orderModel";
import getFilteredOrders from "./getFilteredOrders";
import User from "@/models/userModel";
import { SortOrder } from "mongoose";
import { getServerSessionContext } from "@/lib/checkServerAuth";
import Shop from "@/models/shopModel";


//limit the number of orders for the db query result
const LIMIT = Number(process.env.ORDER_QUERY_LIMIT) || 10

interface SearchParams {
    query?: string | string[];
    page?: number;
    role?: string;
    sort?: string | string[]
}


const getOrders = async (params: SearchParams = {}) => {
    //parameters for pagination, search and sorting
    const { query = '', page = 1, sort = '' } = params;

    // Calculate the number of documents to skip
    const skip = (page - 1) * LIMIT;

    const searchQuery: string = Array.isArray(query) ? query.join(' ') : query;
    const sorting: string = Array.isArray(sort) ? sort.join(' ') : sort;

    //check if user is authenticated and get the user id and role from the session
    try {
        const { merchantId, userId, role } = await getServerSessionContext();
        let searchCriteria = undefined;

        if (role === 'driver') {
            searchCriteria = { asignee: userId }
        } else {
            //get all the connected shop ids
            const connectedShops = await Shop.distinct('_id', { owner: merchantId });;

            //prepare the search criteria to fetch orders for the connected shops
            searchCriteria = { shopId: { $in: connectedShops } }
        }

        //check if the searchCriteria is empty, if yes then return empty orders
        if (!searchCriteria) {
            console.log('No search criteria found for the user. Returning empty orders.');
            return { orders: [], totalPages: 0, totalCount: 0, currentPage: page };
        }

        const sortMap: Record<string, Record<string, SortOrder>> = {
            city_asc: { city: 1, date_created_gmt: -1 },
            city_desc: { city: -1, date_created_gmt: -1 },
        };

        const sortCriteria = sortMap[sorting] || { date_created_gmt: -1 };

        if (searchQuery) {
            const filteredOrders = await getFilteredOrders({ query: searchQuery, sort: sortCriteria, skip, limit: LIMIT });

            return filteredOrders
        }

        //  Fetch Orders & Total Count in Parallel
        const [dbOrders, totalCount] = await Promise.all([
            Order.find(searchCriteria)
                .select('-_id -__v -createdAt -updatedAt -date_created_gmt -date_modified_gmt')
                .populate('asignee', ['name', 'image'], User)
                .limit(LIMIT)
                .sort(sortCriteria)
                .skip(skip)
                .lean(),

            Order.countDocuments(searchCriteria),
        ]);

        // Format Orders for Frontend
        const orders = dbOrders.map((item) => ({
            order_id: item.order_id,
            name: item.name,
            city: item.city,
            address: item.address,
            phone: item.phone,
            payment: item.payment,
            amount: item.amount,
            status: item.status,
            asignee: {
                id: item.asignee?._id?.toString() || '',
                name: item.asignee?.name,
                image: item.asignee?.image,
            },
        }));

        return {
            orders,
            totalPages: Math.ceil(totalCount / LIMIT),
            totalCount,
            currentPage: page,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error in getOrders: ', error.message);
        return { orders: [], totalPages: 0, totalCount: 0, currentPage: page };
    }
};


//return a single order data
export const getSingleOrder = async (order_id: number) => {
    if (!order_id) {
        return null;
    }
    try {
        await dbConnect();
        const order = await Order.findOne({ order_id })
            .select(['order_id', 'payment', 'status', 'asignee'])
            .populate('asignee', ['name', 'image'], User)

        return {
            order_id: order?.order_id,
            payment: order?.payment,
            status: order?.status,
            asignee: {
                id: order?.asignee?._id?.toString() || '',
                name: order?.asignee?.name,
                image: order?.asignee?.image
            }
        };
    } catch (error) {
        console.log('error in getSingleOrder: ', error);
        return null;
    }
}


export default getOrders