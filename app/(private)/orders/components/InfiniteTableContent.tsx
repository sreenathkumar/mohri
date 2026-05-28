'use client'

import getOrders from "@/actions/woocommerce/getOrders";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { useSelectedOrder } from "@/context/SelectedOrderCtx";
import useInView from "@/hooks/useInView";
import { OrderType } from "@/types/OrderType";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderRowItem from "./OrderRowItem";
import { TableRowSkeleton } from "./TableRowSkeleton";
import UpdateOrders from "./UpdateOrders";


function InfiniteTableContent({ orders, columns, totalPages, currentPage }: { orders: OrderType[], columns: number, totalPages: number, currentPage: number }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [initialOrders, setInitialOrders] = useState(orders);
    const [activePage, setActivePage] = useState(currentPage);
    const { ref, inView } = useInView({ threshold: 0.1 });
    const searchParams = useSearchParams();

    //get the url params for filter
    const query = searchParams.get('query') ?? undefined;
    const sort = searchParams.get('sort') ?? undefined;

    //update initial orders when server orders changes
    useEffect(() => {
        setInitialOrders(orders);
        setActivePage(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders])

    //server side event listener for getting updates from woocommerce
    useEffect(() => {
        const eventSource = new EventSource("/api/webhook/updates")

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data) {
                if (data.type === 'DELETE_ORDER') {
                    setInitialOrders(prev => {
                        const exists = prev.some(item => item.order_id === data.order.order_id);

                        if (!exists) {
                            return prev
                        }

                        return prev.filter(item => item.order_id !== data.order.order_id)
                    }
                    )
                } else {
                    setInitialOrders(prev => [data.order, ...prev])
                }
                router.refresh()
            }
        }

        return () => {
            eventSource.close()
        }
    }, [router]);

    useEffect(() => {
        if (!inView || isLoading || activePage >= totalPages) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { orders: newOrders, currentPage } = await getOrders({
                    query,
                    sort,
                    page: activePage + 1,
                });

                if (newOrders?.length > 0) {
                    setInitialOrders(prev => [...prev, ...newOrders]);
                    setActivePage(currentPage);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
        <>
            <TableBody>
                {initialOrders.length > 0 ? initialOrders.map((order: OrderType) => (
                    <OrderRowItem
                        key={order.order_id}
                        order={order}
                    >
                        <EditOrderBtn order_id={order.order_id} />
                    </OrderRowItem>
                )) : <TableRow><TableCell colSpan={columns} className="text-center">No orders found</TableCell></TableRow>
                }
                {activePage < totalPages && <TableRow ref={ref} className="border-b transition-colors hover:bg-muted/50 animate-pulse">
                    <TableRowSkeleton />
                </TableRow>}
            </TableBody>

        </>
    )
}


function EditOrderBtn({ order_id }: { order_id: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const { setSelectedOrder } = useSelectedOrder()

    //close the modal
    const closeModal = () => {
        if (isOpen) {
            setSelectedOrder([]);
        }
        setIsOpen(!isOpen)
    };


    return <Dialog open={isOpen} onOpenChange={closeModal}>
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
}

export default InfiniteTableContent