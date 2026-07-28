'use client';

import { updateDeliveryStatus } from "@/actions/driverActions";
import { OrderStatus } from "@/types/OrderType";

function MakeCurrentBtn({ order_id }: { order_id: number }) {
    const handleMakeCurrent = async () => {
        await updateDeliveryStatus({
            order_id,
            status: OrderStatus.OUT_FOR_DELIVERY
        });
    }
    return (
        <button
            onClick={handleMakeCurrent}
            className="px-3 py-1.5 bg-muted hover:bg-muted/90 text-white rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap flex items-center gap-1.5"
        >
            Start Delivery
        </button>
    )
}

export default MakeCurrentBtn