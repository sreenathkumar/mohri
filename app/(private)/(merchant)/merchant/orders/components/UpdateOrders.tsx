'use client'

import { getAllDrivers } from "@/actions/employee"
import { Button } from "@/components/shadcn/button"
import { useSelectedOrder } from "@/context/SelectedOrderCtx"
import { useCallback, useEffect, useState } from "react"
import OrderBadge from "./OrderBadge"
import { AssigneeUpdateOptions, StatusUpdateOptions } from "./UpdateOptions"
import toast from "react-hot-toast"
import { getSingleOrder, updateOrders } from "@/actions/orderAction"
import { useSWRConfig } from "swr"
import { OrderStatus } from "@/types/OrderType";

//type for drivers object
export interface DriversType {
    id: string,
    name: string,
    image?: string
}

//type for update orders form
interface UpdateOrderType {
    order_ids: number[],
    assignee?: string,
    assignee_name?: string
    status?: string
}

//type for single order data
interface SingleOrderType {
    order_id: number,
    payment: string,
    status: string,
    asignee: {
        id: string,
        name: string,
        image?: string
    }
}

const statuses = Object.values(OrderStatus)
const prepaidOrderStatuses = ['Processing', 'Delivered'];

console.log('statuses: ', Object.values(OrderStatus));

function UpdateOrders({ closeModal, order_id }: { closeModal: () => void, order_id?: number }) {
    const { selectedOrder, setSelectedOrder } = useSelectedOrder();
    const [singleOrder, setSingleOrder] = useState<SingleOrderType | null>(null);
    const [drivers, setDrivers] = useState<DriversType[]>([]);
    const { mutate } = useSWRConfig();

    const removeOrder = (orderId: number) => {
        setSelectedOrder(selectedOrder.filter(id => id !== orderId));
    }

    //handle update order status
    const handleUpdateStatus = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const toastId = toast.loading('Updating orders...');

        if (selectedOrder.length > 0) {

            const formData = new FormData(e.currentTarget);
            const { assignee, status } = Object.fromEntries(formData);
            const assigneeName = drivers.find(driver => driver.id === String(assignee))?.name;

            //constract the update object
            const updateObj: UpdateOrderType = { order_ids: selectedOrder };

            if (assignee || status) {

                if (assignee) updateObj.assignee = assignee.toString();
                if (status) updateObj.status = status.toString();
                if (assigneeName) updateObj.assignee_name = assigneeName

                //update the orders
                const res = await updateOrders(updateObj);

                if (res && res.status === 'success') {
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
            setDrivers([...res]);
        }
    }

    //fetch the single order data
    const fetchSingleOrder = useCallback(async () => {
        const res = await getSingleOrder(order_id!);

        if (res) {
            setSingleOrder(res);
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
                <div className="flex gap-2 border rounded p-4 flex-wrap">
                    {selectedOrder.length > 0 && selectedOrder.map(orderId => <OrderBadge key={orderId} onClose={() => removeOrder(orderId)}>{orderId} </OrderBadge>)
                    }
                </div>
            </div>
            <form className="space-y-6" onSubmit={handleUpdateStatus}>
                <AssigneeUpdateOptions options={drivers} label="Assignee" id="assignee" placeholder="Select an assignee" />
                <StatusUpdateOptions options={singleOrder?.payment === 'hesabe' ? prepaidOrderStatuses : statuses} label="Status" id="status" placeholder="Select a status" />

                <Button type="submit">Update Orders</Button>
            </form>
        </div>
    )
}

export default UpdateOrders