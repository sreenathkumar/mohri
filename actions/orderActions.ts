'use server'

import { getRequiredSessionContext } from '@/lib/auth-context';
import { bulkUpdateOrders, fetchClipboardContent, fetchOrders, fetchSingleOrder, UpdateOrdersParams } from '@/services/orderService';
import { OrderStatus } from '@lib/prisma';

export interface SearchParams {
    query?: string
    page?: number;
    sort?: string
}


export interface UpdateOrderDataType {
    orderIds: number[];
    assigneeId?: string | null;
    assigneeName?: string;
    status?: OrderStatus;
}

/**
 * Fetch orders based on the search parameters provided by the user.
 * @param searchParams parameters searched by the user. i.e name, phone or order_id etc.
 * @returns list of orders based on the search params
 */
export async function getOrders(searchParams: SearchParams = {}) {
    const { query, page, sort } = searchParams;
    try {
        const { organizationId, role, userId } = await getRequiredSessionContext({
            allowedRoles: ["owner", 'manager'],
        });

        //fetch orders based on the role and userId
        const fetchedData = await fetchOrders({ role, userId, organizationId, query, page, sort });

        return fetchedData // Return the fetched data 
    } catch (error: any) {
        console.error('[getOrders] Error fetching orders:', error.message);
        return { orders: [], totalPages: 0, totalCount: 0, currentPage: 1 };
    }
}

/**
 * Fetch a single order based on the provided order ID.
 * @param order_id the id of the order
 * @returns order object
 */
export async function getSingleOrder(order_id: number) {
    if (!order_id) {
        throw new Error('Order ID is required to fetch the order.');
    }
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        //fetch single order based on the role and userId
        const fetchedOrder = await fetchSingleOrder({ orderId: order_id, organizationId });
        return fetchedOrder;
    } catch (error: any) {
        console.error('[getSingleOrder] error in getSingleOrder: ', error.message);
        return null;
    }
}



export async function getAssignedOrders(searchParams: SearchParams = {}) {
    const { query, page, sort } = searchParams;
    try {
        const { role, userId, organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        //fetch assigned orders based on the role and userId
        const fetchedData = await fetchOrders({ role, userId, organizationId, query, page, sort });
        return fetchedData;

    } catch (error: any) {
        console.log('Error fetching assigned orders:', error.message);
        return { orders: [], totalPages: 0, totalCount: 0, currentPage: 1 };
    }
}

/**
 *  Fetch selected orders formatted for Clipboard export
 * @param selectedOrders selected order ids which data will be copied in clipboard
 * @returns formatted text of selected order data
 */
export async function getClipboardContent(selectedOrders: number[]) {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        //fetch clipboard compatible formatting for the selected orders
        const fetchedContent = await fetchClipboardContent({ selectedOrders, organizationId });
        return fetchedContent;
    } catch (error: any) {
        console.error('[getClipboardContent] error in getClipboardContent: ', error.message);
        return null;
    }
}

/**
 *  Update multiple orders based on the provided order IDs, assignee, and status.
 * @param orderIds array of order ids to be updated
 * @param assigneeId id of the assignee to whom the orders are assigned
 * @param assigneeName name of the assignee to whom the orders are assigned
 * @param status new status of the orders to be updated
 * @returns updated orders array
 */
export async function updateOrders({ orderIds, assigneeId, assigneeName, status, }: UpdateOrderDataType) {
    if (!orderIds || orderIds.length === 0) {
        throw new Error('No order IDs provided for update.');
    }
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        if (status === OrderStatus.ASSIGNED && (!assigneeId || !assigneeName)) {
            throw new Error('Assignee ID and name are required when assigning orders.');
        }

        //update orders in db
        await bulkUpdateOrders({
            organizationId,
            orderIds,
            assigneeId,
            assigneeName,
            status,
        });

        return {
            success: true,
            message: 'Orders updated successfully',
        }

    } catch (error: any) {
        console.error('[updateOrders] error in updateOrders: ', error.message);
        return {
            success: false,
            message: error?.message || 'An error occurred while updating orders'
        };
    }
}