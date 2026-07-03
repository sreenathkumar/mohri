'use client'

import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/shadcn/dialog'
import { useSelectedOrder } from '@/context/SelectedOrderCtx'
import UpdateOrders from './UpdateOrders'
import { useState } from 'react'


function UpdateOrderBtn() {
    const { setSelectedOrder, selectedOrder } = useSelectedOrder();
    const [isOpen, setIsOpen] = useState(false);

    //close the modal
    const closeModal = () => {
        if (isOpen) {
            setSelectedOrder([]);
        }
        setIsOpen(!isOpen)
    };
    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogTrigger asChild>
                <Button size="sm" disabled={selectedOrder?.length === 0}>
                    Update Order
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className='mb-4'>
                    <DialogTitle className="font-bold text-2xl lg:text-left">Update Selected Orders</DialogTitle>
                    <DialogDescription className='w-full'>Change the assignee and status for the selected orders.</DialogDescription>
                </DialogHeader>

                <UpdateOrders closeModal={closeModal} />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateOrderBtn