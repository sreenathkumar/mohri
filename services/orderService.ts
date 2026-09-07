import { OrderStatus, Prisma, prisma } from "@/lib/prisma";

const LIMIT = Number(process.env.ORDER_QUERY_LIMIT) || 10;

export interface OrdersFilterParams {
    organizationId: string;
    query?: string;
    page?: number;
    sort?: string;
}

export interface SharableOrderData {
    order_id: string;
    name: string;
    city: string;
    address: string | null;
    phone: string;
    payment: string;
    amount: number;
    status: OrderStatus;
}

export interface UpdateOrdersParams {
    assigneeId?: string | null;
    assigneeName?: string;
    status?: OrderStatus;
    orderIds: string[];
    organizationId: string;
}

/**
 * Fetch paginated orders with search, sorting, and tenant isolation
 */
export async function fetchOrders({
    organizationId,
    query = "",
    page = 1,
    sort = "",
}: OrdersFilterParams) {
    const skip = (page - 1) * LIMIT;
    const searchQuery = query.trim();

    // Build Tenant & Role Scoped Where Clause
    const where: Prisma.OrderWhereInput = {
        shop: { organizationId },
    };

    //Add Search Filter
    if (searchQuery) {
        where.OR = [
            { order_id: { contains: searchQuery, mode: "insensitive" } },
            { name: { contains: searchQuery, mode: "insensitive" } },
            { phone: { contains: searchQuery, mode: "insensitive" } },
            { city: { contains: searchQuery, mode: "insensitive" } },
            { assignee_name: { contains: searchQuery, mode: "insensitive" } },
        ];
    }

    // Sorting Strategy
    let orderBy: Prisma.OrderOrderByWithRelationInput = { date_created_gmt: "asc" };
    if (sort === "city_asc") orderBy = { city: "asc" };
    if (sort === "city_desc") orderBy = { city: "desc" };

    // Execute Queries
    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy,
            skip,
            take: LIMIT,
            select: {
                order_id: true,
                name: true,
                city: true,
                address: true,
                phone: true,
                payment: true,
                amount: true,
                status: true,
                date_delivered: true,
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },
        }),
        prisma.order.count({ where }),
    ]);

    return {
        orders,
        totalPages: Math.ceil(totalCount / LIMIT),
        totalCount,
        currentPage: page,
    };
}

/**
 * Fetch a single order by order_id
 */
export async function fetchSingleOrder({ orderId, organizationId }: { orderId: string, organizationId: string }) {
    if (!orderId || !organizationId) {
        throw new Error('[fetchSingleOrder] Order ID and Organization ID are required to fetch the order.');
    }

    const order = await prisma.order.findFirst({
        where: {
            order_id: orderId,
            shop: { organizationId },
        },
        select: {
            order_id: true,
            payment: true,
            status: true,
            assignee: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    return order;
}

/**
 * Fetch selected orders formatted for Clipboard export
 */
export async function fetchClipboardContent({ selectedOrders, organizationId }: { selectedOrders: string[], organizationId: string }) {
    if (!selectedOrders || selectedOrders.length === 0 || !organizationId) {
        throw new Error('[fetchClipboardContent] Selected order IDs and Organization ID are required to fetch clipboard content.');
    }

    const orders = await prisma.order.findMany({
        where: {
            order_id: { in: selectedOrders },
            shop: { organizationId },
        },
        select: {
            order_id: true,
            name: true,
            city: true,
            address: true,
            phone: true,
            payment: true,
            amount: true,
            status: true,
        },
    });

    if (orders.length === 0) {
        throw new Error('[fetchClipboardContent] No orders found for the provided IDs.');
    }

    return orders.map((order) => formatOrderText(order)).join("\n\n");
}

/**
 * Bulk update order status, assignees, and timestamps
 */
export async function bulkUpdateOrders({
    assigneeId,
    assigneeName,
    status,
    orderIds,
    organizationId,
}: UpdateOrdersParams) {
    if (!orderIds || orderIds.length === 0 || !organizationId) {
        throw new Error('Order IDs and Organization ID are required for bulk update.');
    }

    // case 1: is the new status is PROCESSING
    // then remove all the assigneeId and assigneeName from the orders and set the status to processing
    if (status === OrderStatus.PROCESSING) {
        await prisma.order.updateMany({
            where: {
                shop: { organizationId },
                order_id: { in: orderIds },
            },
            data: {
                assigneeId: null,
                assignee_name: "",
                status: OrderStatus.PROCESSING,
                assignedAt: null,
                date_delivered: null,
            },
        })

        return
    }

    const isUnassigning = assigneeId === "none" || !assigneeId;

    const updateData = {
        assigneeId: isUnassigning ? null : assigneeId,
        assignee_name: isUnassigning ? "" : assigneeName ?? "",
        ...(status && { status }),
        assignedAt: !isUnassigning ? new Date() : null,
        ...(status === OrderStatus.DELIVERED ? { date_delivered: new Date() } : { date_delivered: null }),
    };

    await prisma.order.updateMany({
        where: {
            order_id: { in: orderIds },
        },
        data: updateData,
    });
}

/**
 * Fetch orders assigned to a specific driver/employee
 */
export async function fetchEmployeeOrders(
    userId: string,
    status: OrderStatus,
    organizationId: string
) {
    if (!userId || !organizationId) {
        throw new Error('[fetchEmployeeOrders] User ID and Organization ID are required to fetch employee orders.');
    }

    return await prisma.order.findMany({
        where: {
            shop: { organizationId },
            assigneeId: userId,
            status,
        },
        select: {
            order_id: true,
            name: true,
            city: true,
            address: true,
            phone: true,
            payment: true,
            amount: true,
            status: true,
            assignedAt: true,
            date_delivered: true,
        },
    });
}

/**
 * Format order details into shareable text
 */
function formatOrderText(order: SharableOrderData): string {
    const isPaid = order.payment.toLowerCase() === "hesabe";
    return [
        `Order Number: #${order.order_id}`,
        `Name: ${order.name}`,
        `City: ${order.city}`,
        `Address: ${order.address ?? "N/A"}`,
        `Phone: ${order.phone}`,
        `Payment: ${isPaid ? "PAID" : "Cash On Delivery"}`,
        `Amount: ${isPaid ? "N/A" : order.amount}`,
        `Status: ${order.status}`,
    ].join("\n");
}