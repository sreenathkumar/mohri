'use client'
import { Button } from "@/components/shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import { useMapContext } from "@/context/MapCtx";
import { MapPageOrderType } from "@/types/OrderType";
import { Info, MapPin, X } from "lucide-react";
import { useState } from "react";
import DetailsOpen from "./details-panel";
import { OrderStatus } from "@lib/prisma";

interface PcMapSidebarContentProps {
    orders: MapPageOrderType[];
    pointOutOrder: (order: MapPageOrderType) => void;
    selectedOrder: MapPageOrderType | null;
}

function PcMapSidebarContent({ orders, pointOutOrder, selectedOrder }: PcMapSidebarContentProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
    const { setSelectedOrderId } = useMapContext();

    return (
        <>
            <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`absolute left-6 top-6 z-40 p-3 bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl transition-all duration-300 h-12 w-12 ${sidebarOpen ? 'opacity-0 pointer-events-none' : ''}`}
            >
                <MapPin className="size-6" />
            </Button>
            <div className={`absolute left-6 top-24 bottom-6 z-30 transition-all duration-300 ${sidebarOpen ? 'w-95' : 'w-0 opacity-0 pointer-events-none'}`}>
                <div className="h-full bg-card/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Live Orders</p>
                            <p className="text-lg font-bold text-foreground">{orders.length} Active</p>
                        </div>
                        <Button
                            onClick={() => setSidebarOpen(false)}
                            className=" p-2 bg-transparent hover:bg-white/10 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Orders List */}
                    <div className="flex-1 overflow-y-auto space-y-2 p-4">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => {
                                        setSelectedOrderId(order.id);
                                        setDetailsPanelOpen(true);
                                        pointOutOrder(order);
                                    }}
                                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group backdrop-blur-sm ${selectedOrder?.id === order.id
                                        ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-bold text-foreground truncate">{order.id}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{order.address}</p>
                                            </div>
                                            <div className="flex items-center flex-shrink-0 gap-2">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0 whitespace-nowrap ${order.status === OrderStatus.ASSIGNED ? 'bg-blue-500/20 text-blue-300' :
                                                    order.status === OrderStatus.PROCESSING ? 'bg-yellow-500/20 text-yellow-300' :
                                                        order.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-green-500/20 text-green-300' :
                                                            'bg-red-500/20 text-red-300'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                {(!order.latitude || !order.longitude) && <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-5 w-5 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Missing location coordinates</p>
                                                    </TooltipContent>
                                                </Tooltip>}
                                            </div>

                                        </div>

                                        {order?.assignee?.name && <p className="text-xs text-muted-foreground">{order.assignee.name}</p>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-sm">No orders found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedOrder && <DetailsOpen selectedOrder={selectedOrder} detailPanelOpen={detailsPanelOpen} setDetailPanelOpen={setDetailsPanelOpen} />}

            {selectedOrder && !detailsPanelOpen && (
                <button
                    onClick={() => setDetailsPanelOpen(true)}
                    className="fixed bottom-6 right-6 p-3 bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl transition-all duration-300 z-30"
                >
                    <MapPin className="w-5 h-5" />
                </button>
            )}
        </>
    )
}

export default PcMapSidebarContent