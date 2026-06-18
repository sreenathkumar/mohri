"use server";

import { auth } from "@/auth";
import dbConnect from "@/dbConnect";
import Order from "@/models/orderModel";
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
    //check if user is authenticated and get the user id and role from the session
    const session = await auth();

    if (!session) {
        console.log('User is not authenticated. Cannot fetch orders.');
        return { orders: [], totalPages: 0, totalCount: 0, currentPage: 1 };
    }

    const userId = session.user.id;
    const role = session.user.role;

    const { query = '', skip = 0, limit = 10, page = 1, sort } = params;
    const numQuery = Number(query);
    const isNumber = !isNaN(numQuery);
    console.log('getFilteredOrders params:', { query, skip, limit, page, sort });

    try {
        await dbConnect();

        // Define search criteria
        const searchCriteria = {
            ...(role === 'admin' || role === 'clerk' ? { user_id: userId } : { asignee: userId }),
            $and: [
                { name: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
                { city: { $regex: query, $options: 'i' } },
                { asignee_name: { $regex: query, $options: 'i' } },
                ...(isNumber ? [{ order_id: numQuery }] : [])
            ],
        };

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
