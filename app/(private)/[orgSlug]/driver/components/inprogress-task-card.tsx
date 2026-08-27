'use client';

import { updateDeliveryStatus } from "@/actions/driverActions";
import { Button } from "@/components/shadcn/button";
import { OrderStatus } from "@prisma/client";
import { MessageCircleMore, PhoneCall, TriangleAlert } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
    id: number;
    customer: string;
    location: string;
    amount?: number;
    isOutForDelivery?: boolean;
    note?: string;
}

export default function TaskCard({
    id,
    customer,
    location,
    amount,
    note,
    isOutForDelivery = false,
}: TaskCardProps) {
    const [showMore, setShowMore] = useState(false);

    const handleCall = () => {
        console.log(`Calling customer for order ${id}`);
        //onCall?.(id);
    };

    const handleWhatsApp = () => {
        console.log(`Sending WhatsApp message to order ${id}`);
        //onWhatsApp?.(id);
    };

    const handleReportIssue = async () => {
        await updateDeliveryStatus({
            orderId: id,
            status: OrderStatus.FAILED
        });
    }

    const handleMarkOutForDelivery = async () => {
        if (isOutForDelivery) {
            await updateDeliveryStatus({
                orderId: id,
                status: OrderStatus.DELIVERED
            })
        } else {
            await updateDeliveryStatus({
                orderId: id,
                status: OrderStatus.OUT_FOR_DELIVERY
            })
        }
    }

    return (
        <div className={`group bg-linear-to-br border rounded-xl p-5 space-y-4 transition-all duration-300 ${isOutForDelivery
            ? 'from-muted-background/20 to-muted-background/10 border-muted-background/50 hover:border-muted-background/70 hover:shadow-lg hover:shadow-muted-background/20'
            : 'from-card to-card/80 border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
            }`}>

            {isOutForDelivery && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-foreground">Out for Delivery</span>
                    </div>
                </div>
            )}


            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Order ID</p>
                    <p className='text-sm font-semibold font-mono text-primary'>{id}</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <Button
                        onClick={handleCall}
                        className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/90 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Call customer"
                    >
                        <PhoneCall className="text-lg" />
                    </Button>
                    <Button
                        onClick={handleWhatsApp}
                        className="w-10 h-10 rounded-lg bg-muted hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Send WhatsApp"
                    >
                        <MessageCircleMore className="text-lg" />
                    </Button>
                    <Button
                        onClick={handleReportIssue}
                        className="w-10 h-10 rounded-lg bg-destructive/10 hover:bg-destructive/90 text-foreground flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                        <TriangleAlert className="text-destructive text-lg hover:text-foreground" />
                    </Button>
                </div>
            </div>


            <div className="border-t border-border/30 pt-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Recipient</p>
                <p className="text-base font-semibold text-foreground mb-2">{customer}</p>
                <p className="text-xs text-muted-foreground">{location}</p>
            </div>


            <div className="flex items-center justify-between gap-3 bg-muted/10 rounded-lg p-3 border border-border/30">
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Amount Due</p>
                    <p className="text-lg font-bold text-foreground">{amount || "N/A"}</p>
                </div>
                <button
                    onClick={handleMarkOutForDelivery}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 ${isOutForDelivery
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'bg-primary text-foreground hover:bg-primary/90'
                        }`}
                >
                    {isOutForDelivery ? 'Mark as Delivered' : 'Start Delivery'}
                </button>
            </div>


            {showMore && (
                <div className="border-t border-border/30 pt-3 space-y-2 text-xs animate-in fade-in-50 duration-200">
                    {/* <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/40 rounded-sm p-2">
                            <p className="text-muted-foreground text-xs mb-0.5">Est. Time</p>
                            <p className="font-semibold text-foreground">15-20 min</p>
                        </div>
                        <div className="bg-muted/40 rounded-sm p-2">
                            <p className="text-muted-foreground text-xs mb-0.5">Distance</p>
                            <p className="font-semibold text-foreground">4.2 km</p>
                        </div>
                    </div> */}
                    <div className="p-2">
                        <p className="text-muted-foreground text-xs mb-0.5">Instructions</p>
                        <textarea className="bg-muted/20 rounded-sm font-semibold text-foreground w-full min-h-[88px] mt-2">{note}</textarea>
                    </div>
                </div>
            )}


            <Button
                onClick={() => setShowMore(!showMore)}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2 font-medium bg-transparent hover:bg-transparent"
            >
                {showMore ? '▲ Hide details' : '▼ Show details'}
            </Button>
        </div>
    );
}
