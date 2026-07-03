import dbConnect from "@/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import Shop from "@/models/shopModel";
import { SortOrder } from "mongoose";
import { UpdateOrderDataType } from "@/actions/orderAction";
import { DriverOrderType, OrderStatus } from "@/types/OrderType";

const LIMIT = Number(process.env.ORDER_QUERY_LIMIT) || 10;

const SORT_MAP: Record<string, Record<string, SortOrder>> = {
    city_asc: { city: 1, date_created_gmt: -1 },
    city_desc: { city: -1, date_created_gmt: -1 },
};

interface OrdersFilter {
    userId: string;
    role: string;
    merchantId: string;
    params?: {
        query?: string | string[];
        page?: number;
        sort?: string | string[];
    };
}

interface SharableOrderData {
    order_id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    payment: string;
    amount: string;
    status: string;
}



export async function fetchOrders(params: OrdersFilter) {
    const {
        userId,
        role,
        merchantId,
        params: { query = '', page = 1, sort = '' } = {},
    } = params;

    const searchQuery = Array.isArray(query) ? query.join(' ') : query;
    const sorting = Array.isArray(sort) ? sort.join(' ') : sort;
    const skip = (page - 1) * LIMIT;
    const sortCriteria = SORT_MAP[sorting] ?? { date_created_gmt: -1 };

    try {
        await dbConnect();

        // Build base filter
        let baseFilter: Record<string, unknown>;
        if (role === 'driver') {
            baseFilter = { asignee: userId };
        } else {
            const shopIds = await Shop.distinct('_id', { owner: merchantId });
            baseFilter = { shopId: { $in: shopIds } };
        }

        // Add search conditions
        if (searchQuery) {
            const numQuery = Number(searchQuery);
            const isNumeric = !isNaN(numQuery) && searchQuery.trim() !== '';
            Object.assign(baseFilter, {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { phone: { $regex: searchQuery, $options: 'i' } },
                    { city: { $regex: searchQuery, $options: 'i' } },
                    { asignee_name: { $regex: searchQuery, $options: 'i' } },
                    ...(isNumeric ? [{ order_id: numQuery }] : []),
                ],
            });
        }

        // Projection differs by role
        const projection = role === 'driver'
            ? 'order_id payment amount status date_delivered -_id'
            : '-_id -__v -createdAt -updatedAt -date_created_gmt -date_modified_gmt';

        const [rawOrders, totalCount] = await Promise.all([
            Order.find(baseFilter)
                .select(projection)
                .populate(role !== 'driver' ? [{ path: 'asignee', select: 'name image', model: User }] : [])
                .sort(sortCriteria)
                .skip(skip)
                .limit(LIMIT)
                .lean(),

            Order.countDocuments(baseFilter),
        ]);

        const orders = rawOrders.map((item) => {
            if (role === 'driver') return item

            return {
                order_id: item.order_id,
                name: item.name,
                city: item.city,
                address: item.address,
                phone: item.phone,
                payment: item.payment,
                amount: item.amount,
                status: item.status,
                date_delivered: item.date_delivered,
                asignee: {
                    id: item.asignee?._id?.toString() ?? '',
                    name: item.asignee?.name,
                    image: item.asignee?.image,
                },
            }
        });

        return { orders, totalPages: Math.ceil(totalCount / LIMIT), totalCount, currentPage: page };

    } catch (error: unknown) {
        console.error('fetchOrders error:', (error as Error).message);
        return { orders: [], totalPages: 0, totalCount: 0, currentPage: page };
    }
}



export async function fetchSingleOrder(order_id: number) {
    if (!order_id) {
        return null;
    }

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
}



function formatOrderText(order: SharableOrderData): string {
    const isPaid = order.payment === 'hesabe';
    return [
        `Order Number: #${order.order_id}`,
        `Name: ${order.name}`,
        `City: ${order.city}`,
        `Address: ${order.address}`,
        `Phone: ${order.phone}`,
        `Payment: ${isPaid ? 'PAID' : 'Cash On Delivery'}`,
        `Amount: ${isPaid ? 'N/A' : order.amount}`,
        `Status: ${order.status}`,
    ].join('\n');
}

export async function fetchClipboardContent(selectedOrders: number[]) {
    if (selectedOrders.length <= 0) {
        return null
    }

    await dbConnect();
    const orders = await Order.find({ order_id: { $in: selectedOrders } }).select(['order_id', 'name', 'city', 'address', 'phone', 'payment', 'amount', 'status']);

    if (orders.length <= 0) {
        return null
    }

    const text = orders.map(order => formatOrderText(order)).join('\n');

    return text;
}



export async function updateOrdersToDB({ assignee, assignee_name, status, order_ids }: UpdateOrderDataType) {

    if (!order_ids || order_ids.length === 0) return null

    //connect to the database
    await dbConnect();

    const updatedData = {
        asignee: assignee === 'none' ? null : assignee,
        asignee_name: assignee === 'none' ? '' : assignee_name,
        status: status,
        ...(assignee && assignee !== 'none' ? { assignedAt: Date.now() } : { assignedAt: null }),
        ...(status && status === OrderStatus.DELIVERED ? { date_delivered: Date.now() } : { date_delivered: null })
    }

    //update the orders
    const orders = await Order.updateMany({
        order_id: { $in: order_ids }
    }, updatedData);

    //return the response
    if (orders.modifiedCount && orders.modifiedCount > 0) {
        return orders
    }

    return null

}



export async function fetchEmployeeOrders({ userId, status }: { userId: string, status: OrderStatus }) {
    //connect to the database
    await dbConnect();

    //query the database for all orders assigned to the employee with the given status
    const orders = await Order.find({ asignee: userId, status: status })
        .select('order_id name city address phone payment amount status assignedAt date_delivered -_id')
        .lean<DriverOrderType[]>();

    return orders;
}

