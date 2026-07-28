'use client'

import { updateOrderCoordinates } from "@/actions/mapActions"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { useMapContext } from "@/context/MapCtx"
import { FormState } from "@/lib/zod"
import { MapPageOrderType } from "@/types/OrderType"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@shadcn/drawer"
import { MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import toast from "react-hot-toast"

interface MobileDrawerProps {
  orders: MapPageOrderType[];
  selectedOrder: MapPageOrderType | null;
}

const initialFormState: FormState = {
  success: false,
  message: '',
  errors: {}
};

function MobileDrawer({ orders }: MobileDrawerProps) {
  const [activeShowMore, setActiveShowMore] = useState<string | null>(null);
  const { mapRef } = useMapContext();
  const [state, updateCoordinates] = useActionState(updateOrderCoordinates, initialFormState);
  const router = useRouter();

  const handleFormSubmit = async (formData: FormData) => {
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    if (latitude.length > 0 || longitude.length > 0) {
      updateCoordinates(formData);
      router.refresh();
    }
  }

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

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state])

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          className="absolute left-6 top-6 z-40 p-3 bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl transition-all duration-300"
        >
          <MapPin className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader className="py-3 border-b border-border/30">
          <DrawerTitle className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Live Orders</DrawerTitle>
          <DrawerDescription className="text-lg font-bold text-foreground">{orders.length} Active</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 gap-4 flex flex-col flex-1 py-6">
          {
            orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="group bg-linear-to-br border rounded-xl space-y-4 transition-all duration-300">
                  {/* card header */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4 flex justify-between rounded-t-xl mb-0">
                    <div className="flex flex-col">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Order ID</p>
                      <p className={`text-sm font-semibold font-mono`}>{order.id}</p>
                    </div>
                    <Button
                      onClick={() => pointOutOrder(order)}
                      className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl transition-all duration-300"
                    >
                      <MapPin className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 p-3 m-0">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Address</p>
                      <p className="text-base font-semibold text-foreground">{order.address}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Assignee</p>
                      <p className="text-base font-semibold text-foreground">{order.assignee.name || 'Not assigned'}</p>
                    </div>
                    {activeShowMore === order.id && (
                      <form action={handleFormSubmit} id="update-coordinate-form" className="bg-primary/10 rounded-lg p-3 space-y-2" >
                        <p className="text-xs uppercase text-muted-foreground font-semibold">Custom Location</p>
                        <Input hidden type="text" name='orderId' value={order.id} readOnly />
                        <Input
                          type="number"
                          step="0.0001"
                          defaultValue={order.latitude || ''}
                          name='latitude'
                          placeholder="Latitude"
                          className="w-full px-2 py-1.5 bg-white/10 border border-primary/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs"
                        />
                        <Input
                          type="number"
                          step="0.0001"
                          name='longitude'
                          defaultValue={order.longitude || ''}
                          placeholder="Longitude"
                          className="w-full px-2 py-1.5 bg-white/10 border border-primary/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs"
                        />

                        <Button type="submit" className="w-full text-xs h-8 bg-primary hover:bg-primary/90 text-white cursor-pointer">
                          Relocate
                        </Button>
                      </form>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveShowMore(activeShowMore === order.id ? null : order.id)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2 font-medium"
                  >
                    {activeShowMore === order.id ? '▲ Hide details' : '▼ Show details'}
                  </button>
                </div>

              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">No orders found</p>
              </div>
            )
          }
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileDrawer