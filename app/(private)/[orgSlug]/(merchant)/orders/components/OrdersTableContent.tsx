'use client';

import { useCallback, useState, useMemo } from 'react';
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { Button } from '@/components/shadcn/button';
import { Skeleton } from '@/components/shadcn/skeleton';

import OrderRowItem from "./OrderRowItem";
import UpdateOrders from './UpdateOrders';
import { OrderType } from "@/types/OrderType";
import { useSelectedOrder } from '@/context/SelectedOrderCtx';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
});

interface OrdersTableContentProps {
    columns: number;
    fallbackData: OrderType[];
}

function OrdersTableContent({ columns, fallbackData }: OrdersTableContentProps) {
    const searchParams = useSearchParams();

    // Get current active URL query/sort states
    const query = searchParams.get('query') || '';
    const sort = searchParams.get('sort') || '';
    const pageNumber = parseInt(searchParams.get('page') || '1', 10);

    // Generate stable SWR key using useMemo
    const swrKey = useMemo(() => {
        const cleanParams = new URLSearchParams();
        cleanParams.append('page', pageNumber.toString());

        if (query.trim() !== '') {
            cleanParams.append('query', query);
        }
        if (sort.trim() !== '') {
            cleanParams.append('sort', sort);
        }

        return `/api/webhook/updates?${cleanParams.toString()}`;
    }, [pageNumber, query, sort]);

    // Prevent infinite fallback assignment re-renders by memoizing the SWR options fallback
    const swrOptions = useMemo(() => ({
        refreshInterval: 60000,
        revalidateFirstPage: true,
        keepPreviousData: true,
        fallbackData: { orders: fallbackData },
    }), [fallbackData]);

    //Infinite Scroll Data Layer setup
    const { data, isLoading } = useSWR<{ orders: OrderType[] }>(
        swrKey,
        fetcher,
        swrOptions
    );

    const orders = data?.orders ?? [];

    return (
        <TableBody>
            {orders.length > 0 ? (
                orders.map((order: OrderType) => (
                    <OrderRowItem key={order.order_id} order={order}>
                        <EditOrderBtn order_id={order.order_id} />
                    </OrderRowItem>
                ))
            ) : !isLoading ? (
                <TableRow className="border-b border-border/60 hover:bg-muted/10 transition-colors group">
                    <TableCell colSpan={columns} className="px-6 py-4 font-medium text-center text-muted-foreground">
                        No orders found
                    </TableCell>
                </TableRow>
            ) : (
                Array.from({ length: 10 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex} className="border-b border-border/60 hover:bg-muted/10 transition-colors group">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton className="h-4 w-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            )}
        </TableBody>
    );
}

// Keep EditOrderBtn down here, optimized with stable callbacks
function EditOrderBtn({ order_id }: { order_id: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const { setSelectedOrder } = useSelectedOrder();

    // Use useCallback to maintain stable reference when passed down to <UpdateOrders />
    const closeModal = useCallback(() => {
        if (isOpen) {
            setSelectedOrder([]);
        }
        setIsOpen((prev) => !prev);
    }, [isOpen, setSelectedOrder]);

    const handleEditClick = useCallback(() => {
        setSelectedOrder([order_id]);
    }, [order_id, setSelectedOrder]);

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogTrigger asChild>
                <Button variant="link" onClick={handleEditClick}>
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle className="font-bold text-2xl">Update Selected Orders</DialogTitle>
                    <DialogDescription>Change the assignee and status for the selected orders.</DialogDescription>
                </DialogHeader>
                <UpdateOrders closeModal={closeModal} order_id={order_id} />
            </DialogContent>
        </Dialog>
    );
}

export default OrdersTableContent;