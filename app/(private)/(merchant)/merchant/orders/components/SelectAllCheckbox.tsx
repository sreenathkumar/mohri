'use client'

import { Checkbox } from '@/components/shadcn/checkbox';
import { useSelectedOrder } from '@/context/SelectedOrderCtx';

function SelectAllCheckbox({ orders }: { orders: number[] }) {
    const { selectedOrder, setSelectedOrder } = useSelectedOrder();

    // function which will add all the orders to the selected orders and vice versa
    const handleCheckboxChange = (checked: boolean) => {
        if (checked) {
            setSelectedOrder([...orders]);
        } else {
            setSelectedOrder([]);
        }
    }

    return (
        <Checkbox onCheckedChange={handleCheckboxChange} checked={selectedOrder.length === orders.length} />
    )
}

export default SelectAllCheckbox