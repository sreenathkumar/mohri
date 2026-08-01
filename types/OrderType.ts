import { getOrders } from "@/actions/orderActions";
import { OrderStatus } from '@lib/prisma';

export type OrderType = Awaited<ReturnType<typeof getOrders>>['orders'][number]
export type AssigneeType = OrderType['assignee'] extends null ? null : {
    id: string;
    name: string;
    email: string;
    image: string | null;
}


export interface OrderLocationType {
    order_id: number;
    city: string;
    address: {
        block?: string;
        street?: string;
        house?: string;
        jaddah?: string;
    };
    asignee_name: string;
    asignee: string;
    coordinates: {
        lat: number;
        lon: number;
    } | null;
}

export interface OrderInfoType {
    order_id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    amount: string;
    payment?: string;
    latitude?: number;
    longitude?: number;
    country_code?: string;
    date_created_gmt: string;
    date_modified_gmt: string;
}

// export enum OrderStatus {
//     PROCESSING = 'PROCESSING',
//     CANCELLED = 'CANCELLED',
//     ASSIGNED = 'ASSIGNED',
//     OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
//     DELIVERED = 'DELIVERED',     // Cash collected by driver
//     RECONCILED = 'RECONCILED',   // Cash handed to merchant
//     FAILED = 'FAILED'
// }

export interface DriverOrderType {
    order_id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    payment?: string;
    amount: string;
    status: OrderStatus;
    assignedAt?: string;
    date_delivered?: string;
}

export type MapPageOrderType = {
    id: OrderType['order_id'];
    status: Extract<OrderStatus, 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'PROCESSING' | 'CANCELED'>;
    latitude: number | null;
    longitude: number | null;
    name: OrderType['name'];
    address: OrderType['address'];
    assignee: Pick<AssigneeType, 'id' | 'name'> | null;
}
