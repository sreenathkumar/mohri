'use client'

import { getAllDrivers } from "@/actions/employeeActions"
import { Button } from "@/components/shadcn/button"
import { useSelectedOrder } from "@/context/SelectedOrderCtx"
import { useCallback, useEffect, useState } from "react"
import OrderBadge from "./OrderBadge"
import { AssigneeUpdateOptions, StatusUpdateOptions } from "./UpdateOptions"
import { getSingleOrder, updateOrders } from "@/actions/orderActions"
import { useSWRConfig } from "swr"
import { OrderStatus } from "@prisma/client"
import { toast } from "sonner"

//type for drivers object
export interface DriversType {
    id: string,
    name: string,
    image?: string
}

//type for single order data
interface SingleOrderType {
    order_id: string,
    payment: string,
    status: string,
    assignee?: {
        id: string,
        name: string,
        image?: string
    }
}


function UpdateOrders({ closeModal, order_id }: { closeModal: () => void, order_id?: string }) {
    const { selectedOrder, setSelectedOrder } = useSelectedOrder();
    const [singleOrder, setSingleOrder] = useState<SingleOrderType | null>(null);
    const [drivers, setDrivers] = useState<DriversType[]>([]);
    const { mutate } = useSWRConfig();

    const removeOrder = (orderId: string) => {
        setSelectedOrder(selectedOrder.filter(id => id !== orderId));
    }

    //handle update order status
    const handleUpdateStatus = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const toastId = toast.loading('Updating orders...');

        if (selectedOrder.length > 0) {

            const formData = new FormData(e.currentTarget);
            const assigneeId = formData.get('assigneeId') as string || 'none';
            const status = formData.get('status') as OrderStatus || undefined
            const assigneeName = drivers.find(driver => driver.id === String(assigneeId))?.name;

            if (assigneeId || status) {
                //update the orders
                const res = await updateOrders({
                    orderIds: selectedOrder,
                    assigneeId: assigneeId === 'none' ? null : String(assigneeId),
                    assigneeName: assigneeName || '',
                    status: status
                });

                if (res && res.success) {
                    setSelectedOrder([]);
                    mutate(
                        (key) => typeof key === 'string' && key.startsWith('/api/webhook/updates'),
                        undefined,
                        { revalidate: true }
                    );
                    toast.success(res.message, { id: toastId });
                    closeModal();
                } else {
                    toast.error(res.message, { id: toastId });
                }

            } else {
                toast.error('Please update at least one field', { id: toastId });
            }
        } else {
            toast.error('Please select at least one order', { id: toastId });
        }

    }

    //fetch the drivers
    const fetchDrivers = async () => {
        const res = await getAllDrivers();

        if (res && res.length > 0) {
            setDrivers(res.map(driver => ({
                id: driver.id,
                name: driver.name,
                image: driver.image || undefined
            })));
        }
    }

    //fetch the single order data
    const fetchSingleOrder = useCallback(async () => {
        const res = await getSingleOrder(order_id!);

        if (res) {
            setSingleOrder({
                order_id: res.order_id,
                payment: res.payment,
                status: res.status,
                assignee: res.assignee ? {
                    id: res.assignee.id,
                    name: res.assignee.name,
                    image: res.assignee.image || undefined
                } : undefined
            });
        }

    }, [order_id])

    //update drivers on page load
    useEffect(() => {
        fetchDrivers();
    }, []);

    //update single order on page load
    useEffect(() => {
        fetchSingleOrder();
    }, [fetchSingleOrder]);


    return (
        <div className="flex flex-col gap-6">
            <div className="relative flex flex-col">
                <h3 className="text-lg font-medium">Selected Orders:</h3>
                <div className="flex gap-2 border rounded-sm p-4 flex-wrap">
                    {selectedOrder.length > 0 && selectedOrder.map(orderId => <OrderBadge key={orderId} onClose={() => removeOrder(orderId)}>{orderId} </OrderBadge>)
                    }
                </div>
            </div>
            <form className="space-y-6" onSubmit={handleUpdateStatus}>
                <AssigneeUpdateOptions options={drivers} label="Assignee" id="assignee" placeholder="Select an assignee" />
                <StatusUpdateOptions label="Status" id="status" placeholder="Select a status" />
                <Button type="submit">Update Orders</Button>
            </form>
        </div>
    )
}

export default UpdateOrders