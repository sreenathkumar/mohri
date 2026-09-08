'use client'

import { useSidebar } from "@/components/shadcn/sidebar";
import { useMapContext } from "@/context/MapCtx";
import { MapPageOrderType } from "@/types/OrderType"
import dynamic from "next/dynamic"
import MobileDrawer from "./mobile-map-sidebar-content";
import PcMapSidebarContent from "./pc-map-sidebar-content";

// Dynamically import the Map component with no SSR to avoid issues with window object
const AdminMap = dynamic(() => import("./admin-map"), { ssr: false })

function Map({ orders }: { orders: MapPageOrderType[] }) {
    const { selectedOrderId, mapRef } = useMapContext();
    const { isMobile } = useSidebar()

    const selectedOrder = orders.find(order => order.order_id === selectedOrderId) || null;

    const pointOutOrder = (order: MapPageOrderType) => {
        if (!mapRef) return;

        if (order.latitude && order.longitude) {
            mapRef.flyTo({
                center: [order.longitude, order.latitude],
                zoom: 10,
                speed: 1.2,
                curve: 1.42,
            });
        }
    }
    return (
        <>
            <div className="flex-1 relative">
                <AdminMap orders={orders} />
            </div>

            {isMobile ?
                <MobileDrawer orders={orders} selectedOrder={selectedOrder} />

                : <PcMapSidebarContent orders={orders} pointOutOrder={pointOutOrder} selectedOrder={selectedOrder} />
            }
        </>
    )
}

export default Map