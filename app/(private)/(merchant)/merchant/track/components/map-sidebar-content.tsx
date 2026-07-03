'use client'
import { OrderLocationType } from "@/types/OrderType"
import LocationCard from "./location-card"
import { useMapContext } from "@/context/MapCtx";


function MapSiderbarContent() {
    const { locations: orderData } = useMapContext();

    if (!orderData || orderData.length === 0) {
        return <div className="p-4 text-muted-foreground">No orders available</div>
    }

    return (
        <div className="space-y-4 w-full h-full overflow-y-auto">
            {
                orderData.map((order: OrderLocationType) => <LocationCard key={order.order_id} order={order} />)
            }
        </div>
    )
}

export default MapSiderbarContent