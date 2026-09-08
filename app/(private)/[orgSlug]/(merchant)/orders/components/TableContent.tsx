'use client'

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { useSelectedOrder } from "@/context/SelectedOrderCtx";
import { OrderType } from "@/types/OrderType";
import { useEffect, useState } from "react";
import OrderRowItem from "./OrderRowItem";
import UpdateOrders from "./UpdateOrders";
import { useRouter } from "next/navigation";

function TableContent({ orders, columns }: { orders: OrderType[], columns: number }) {
    const router = useRouter();

    useEffect(() => {
        const eventSource = new EventSource("/api/webhook/updates")

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data) {
                router.refresh()
            }
        }

        return () => {
            eventSource.close()
        }
    }, [router])

    return (
        <TableBody>
            {orders.length > 0 ? orders.map((order: OrderType) => (
                <OrderRowItem
                    key={order.order_id}
                    order={order}
                >
                    <EditOrderBtn order_id={order.order_id} />
                </OrderRowItem>
            )) : <TableRow><TableCell colSpan={columns} className="text-center">No orders found</TableCell></TableRow>}
        </TableBody>
    )
}

function EditOrderBtn({ order_id }: { order_id: string }) {
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

export default TableContent