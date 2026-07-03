'use client'

import { Button } from "@/components/shadcn/button"
import { Card, CardContent } from "@/components/shadcn/card"
import { OrderLocationType } from "@/types/OrderType"
import { MapPin } from "lucide-react"
import RelocateOrder from "./relocate-order"

function LocationCard({ order }: { order: OrderLocationType }) {
    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="font-bold text-lg">{order.order_id}</div>
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground">{order.asignee_name}</div>
                        <div className="flex gap-2">
                            <RelocateOrder order_id={order.order_id} />
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white text-black"
                                disabled={!order.coordinates}
                            >
                                <MapPin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LocationCard