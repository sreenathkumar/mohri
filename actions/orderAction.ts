'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSessionContext } from '@/lib/checkServerAuth'
import { fetchClipboardContent, fetchEmployeeOrders, fetchOrders, fetchSingleOrder, updateOrdersToDB } from '@/services/orders'
import { OrderStatus } from '@/types/OrderType'

export interface SearchParams {
    query?: string | string[];
    page?: number;
    sort?: string | string[];
}


export interface UpdateOrderDataType {
    assignee?: string,
    assignee_name?: string,
    status?: string,
    order_ids: number[]
}

export async function getOrders(searchParams: SearchParams = {}) {
    try {
        const { role, userId, merchantId } = await getServerSessionContext();

        //fetch orders based on the role and userId
        const fetchedData = await fetchOrders({ role, userId, merchantId, params: { ...searchParams } });

        //filter the orders
        const filteredOrders = fetchedData.orders.map((item: any) => ({
            order_id: item.order_id,
            name: item.name,
            city: item.city,
            address: item.address,
            phone: item.phone,
            payment: item.payment,
            amount: item.amount,
            status: item.status,
            asignee: item.asignee
        }));

        return {
            orders: filteredOrders,
            totalPages: fetchedData.totalPages,
            totalCount: fetchedData.totalCount,
            currentPage: searchParams.page || 1,
        };

    } catch (error: any) {
        console.log('Error fetching orders:', error.message);
        return { orders: [], totalPages: 0, totalCount: 0, currentPage: 1 };
    }
}



export async function getSingleOrder(order_id: number) {
    if (!order_id) {
        return null;
    }
    try {
        const res = await getServerSessionContext();

        if (!res) {
            console.log('User is not authenticated or session is invalid.');
            return null;
        }

        //fetch single order based on the role and userId
        const fetchedOrder = await fetchSingleOrder(order_id);
        return fetchedOrder;
    } catch (error: any) {
        console.log('error in getSingleOrder: ', error.message);
        return null;
    }
}



export async function getAssignedOrders(searchParams: SearchParams = {}) {
    try {
        const { role, userId, merchantId } = await getServerSessionContext();

        //fetch assigned orders based on the role and userId
        const fetchedData = await fetchOrders({ role, userId, merchantId, params: searchParams });
        return fetchedData;

    } catch (error: any) {
        console.log('Error fetching assigned orders:', error.message);
        return { orders: [], totalPages: 0, totalCount: 0, currentPage: 1 };
    }
}



export async function getClipboardContent(selectedOrders: number[]) {
    try {
        const session = await getServerSessionContext();

        if (!session) {
            console.log('User is not authenticated or session is invalid.');
            return null;
        }

        //fetch clipboard content
        const fetchedContent = await fetchClipboardContent(selectedOrders);
        return fetchedContent;

    } catch (error: any) {
        console.log('error in getClipboardContent: ', error.message);
        return null;
    }
}



export async function updateOrders({ assignee, assignee_name, status, order_ids }: UpdateOrderDataType) {
    if (!order_ids || order_ids.length === 0) return {
        status: 'error',
        message: 'No orders selected'
    }
    try {
        const session = await getServerSessionContext();

        if (!session) {
            console.log('User is not authenticated or session is invalid.');
            return {
                status: 'error',
                message: 'User is not authenticated or session is invalid.'
            };
        }

        //update orders in db
        const updatedOrders = await updateOrdersToDB({ assignee, assignee_name, status, order_ids });

        if (updatedOrders) {
            return {
                status: 'success',
                message: 'Orders updated successfully'
            };
        } else {
            return {
                status: 'error',
                message: 'Failed to update orders'
            };
        }

    } catch (error: any) {
        console.log('error in updateOrders: ', error.message);
        return {
            status: 'error',
            message: 'An error occurred while updating orders'
        };
    }
}



export async function getEmployeeOrders({ userId, status }: { userId: string, status: OrderStatus }) {
    try {
        const { role } = await getServerSessionContext();

        if (role === 'merchant' || role === 'clerk') {
            //fetch employee orders from the database
            const orders = await fetchEmployeeOrders({ userId, status });

            return orders;
        }

        throw new Error('Unauthorized access: Only employees or merchant can access this resource.');

    } catch (error: any) {
        console.log('error in getting employee orders: ', error.message);
        return []
    }
}