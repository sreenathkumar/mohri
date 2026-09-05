import { getOwnerMapData } from "@/actions/mapActions";
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
    order_id: string;
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
    order_id: string;
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

export interface DriverOrderType {
    order_id: string;
    name: string;
    city: string;
    address: string | null;
    phone: string;
    payment?: string;
    amount: number;
    status: OrderStatus;
    assignedAt: Date | null;
    date_delivered: Date | null;
}

export type MapPageOrderType = Awaited<ReturnType<typeof getOwnerMapData>>[number] 
