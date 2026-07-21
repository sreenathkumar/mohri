'use client'

import { Checkbox } from "@/components/shadcn/checkbox"
import { useSelectedOrder } from "@/context/SelectedOrderCtx"

function OrderCheckbox({ id }: { id: number }) {
    const { selectedOrder, setSelectedOrder } = useSelectedOrder();

    const handleCheckboxChange = (checked: boolean) => {
        if (checked) {
            setSelectedOrder([...selectedOrder, id])
        } else {
            setSelectedOrder(selectedOrder.filter(orderId => orderId !== id))
        }
    }
    return (
        <Checkbox onCheckedChange={handleCheckboxChange} checked={selectedOrder.includes(id)} className="border-muted-foreground/30" />
    )
}

export default OrderCheckbox