'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import OrderRowItem from "./OrderRowItem";
import { OrderType } from "@/types/OrderType";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useState } from 'react';
import { useSelectedOrder } from '@/context/SelectedOrderCtx';
import { Button } from '@/components/shadcn/button';
import UpdateOrders from './UpdateOrders';
import { Skeleton } from '@/components/shadcn/skeleton';

const defaultTableColumns = ['Order Number', 'Name', 'City', 'Address', 'Phone Number', 'Payment', 'Amount', 'Status', 'Asignee', 'Actions'];
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function OrdersTableContent({ columns, fallbackData }: { columns: number, fallbackData: OrderType[] }) {
    const searchParams = useSearchParams();

    // Get current active URL query/sort states
    const query = searchParams.get('query') || '';
    const sort = searchParams.get('sort') || '';
    const pageNumber = parseInt(searchParams.get('page') || '1', 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getKey = (pageIndex: number) => {
        // Return structured API string layout for cache sorting
        return `/api/webhook/updates?query=${encodeURIComponent(query)}&sort=${sort}&page=${pageIndex}`;
    };

    //Infinite Scroll Data Layer setup
    const { data, isLoading } = useSWR(getKey(pageNumber), fetcher, {
        refreshInterval: 60000,
        revalidateFirstPage: true,
        keepPreviousData: true,
        fallbackData: { orders: fallbackData },
    });

    const { orders }: { orders: OrderType[] } = data || { orders: [] }; // Ensure orders is always defined as an array

    return (
        <TableBody>
            {orders?.length > 0 ? (
                orders.map((order: OrderType) => (
                    <OrderRowItem key={order.order_id} order={order}>
                        <EditOrderBtn order_id={order.order_id} />
                    </OrderRowItem>
                ))
            ) : !isLoading ? (
                <TableRow>
                    <TableCell colSpan={columns} className="text-center">No orders found</TableCell>
                </TableRow>
            ) : Array.from({ length: 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {defaultTableColumns.map((col) => (
                        <TableCell key={col}>
                            <Skeleton className="h-4 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}

        </TableBody>
    )
}


// Keep your EditOrderBtn component logic down here as-is...
function EditOrderBtn({ order_id }: { order_id: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const { setSelectedOrder } = useSelectedOrder()

    const closeModal = () => {
        if (isOpen) {
            setSelectedOrder([]);
        }
        setIsOpen(!isOpen)
    };

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogTrigger asChild>
                <Button variant='link' onClick={() => setSelectedOrder([order_id])} >
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className='mb-4'>
                    <DialogTitle className="font-bold text-2xl">Update Selected Orders</DialogTitle>
                    <DialogDescription>Change the assignee and status for the selected orders.</DialogDescription>
                </DialogHeader>
                <UpdateOrders closeModal={closeModal} order_id={order_id} />
            </DialogContent>
        </Dialog>
    )
}


export default OrdersTableContent