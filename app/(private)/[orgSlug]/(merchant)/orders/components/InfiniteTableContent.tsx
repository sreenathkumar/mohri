'use client'

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { useSelectedOrder } from "@/context/SelectedOrderCtx";
import useInView from "@/hooks/useInView";
import { OrderType } from "@/types/OrderType";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRInfinite from 'swr/infinite'; // <-- Import SWR Infinite
import OrderRowItem from "./OrderRowItem";
import { TableRowSkeleton } from "./TableRowSkeleton";
import UpdateOrders from "./UpdateOrders";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function InfiniteTableContent({ columns }: { columns: number }) {
    const { ref, inView } = useInView({ threshold: 0.1 });
    const searchParams = useSearchParams();

    // Get current active URL query/sort states
    const query = searchParams.get('query') || '';
    const sort = searchParams.get('sort') || '';

    //Tells SWR how to paginate while retaining current filters

    const getKey = (pageIndex: number, previousPageData: any) => {
        console.log('running the swr getkey')
        // Reached the end of data pages
        if (previousPageData && pageIndex >= previousPageData.totalPages) return null;

        // Return structured API string layout for cache sorting
        return `/api/webhook/updates?query=${encodeURIComponent(query)}&sort=${sort}&page=${pageIndex + 1}`;
    };

    //Infinite Scroll Data Layer setup
    const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher, {
        refreshInterval: 5000,
        revalidateFirstPage: true,
        keepPreviousData: true
    });

    // Flatten nested API results structure [[Page 1 Orders], [Page 2 Orders]] -> [All Orders]
    const allOrders: OrderType[] = data ? data.flatMap(page => page.orders) : [];
    const totalPages = data ? data[0]?.totalPages : 1;
    const isLoadingMore = isValidating && size > 1;
    const hasMorePages = size < totalPages;

    //Trigger next page content when intersection observer hits viewport boundary
    useEffect(() => {
        if (inView && hasMorePages && !isValidating) {
            setSize(size + 1);
        }
    }, [inView, hasMorePages, isValidating, size, setSize]);

    return (
        <TableBody>
            {allOrders.length > 0 ? (
                allOrders.map((order: OrderType) => (
                    <OrderRowItem key={order.order_id} order={order}>
                        <EditOrderBtn order_id={order.order_id} />
                    </OrderRowItem>
                ))
            ) : !isValidating ? (
                <TableRow>
                    <TableCell colSpan={columns} className="text-center">No orders found</TableCell>
                </TableRow>
            ) : null}

            {/* Render loading skeletons based on state matching */}
            {(hasMorePages || isLoadingMore) && (
                <TableRow ref={ref} className="border-b transition-colors hover:bg-muted/50 animate-pulse">
                    <TableRowSkeleton />
                </TableRow>
            )}
        </TableBody>
    );
}

// Keep your EditOrderBtn component logic down here as-is...
function EditOrderBtn({ order_id }: { order_id: string }) {
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

export default InfiniteTableContent;