'use client'

import { updateOrderCoordinates } from "@/actions/mapActions";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { FormState } from "@/lib/zod";
import { MapPageOrderType } from "@/types/OrderType";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

interface DetailsOpenProps {
    selectedOrder: MapPageOrderType;
    detailPanelOpen: boolean;
    setDetailPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialFormState: FormState = {
    success: false,
    message: '',
    errors: {}
};

function DetailsOpen({ selectedOrder, detailPanelOpen, setDetailPanelOpen, }: DetailsOpenProps) {
    const [state, updateCoordinates, isPending] = useActionState(updateOrderCoordinates, initialFormState);
    const router = useRouter();

    const handleFormSubmit = async (formData: FormData) => {
        const latitude = formData.get('latitude') as string;
        const longitude = formData.get('longitude') as string;

        if (latitude.length > 0 || longitude.length > 0) {
            updateCoordinates(formData);
            router.refresh();
        }
    }

    useEffect(() => {
        if (!state.message) return;

        if (state.success) {
            toast.success(state.message);
        } else {
            toast.error(state.message);
        }
    }, [state])

    return (
        <div className={`fixed right-6 bottom-6 top-auto h-96 bg-card/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 z-40 overflow-hidden flex flex-col ${detailPanelOpen ? 'w-full sm:w-96 opacity-100' : 'w-0 opacity-0 pointer-events-none'
            }`}>

            {/* Header - Fixed size determined by its own padding */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <p className="text-sm font-bold text-foreground">{selectedOrder.id}</p>
                <Button
                    onClick={() => setDetailPanelOpen(false)}
                    className="p-1.5 bg-transparent hover:bg-white/10 rounded-lg transition"
                >
                    <X className="w-4 h-4 text-muted-foreground" />
                </Button>
            </div>

            {/* Details Content - Now safely takes up remaining space and scrolls */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Address</p>
                    <p className="text-xs text-foreground leading-relaxed">{selectedOrder.address}</p>
                </div>

                {/* Assignee */}
                <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Assignee</p>
                    <p className="text-sm font-medium text-foreground">{selectedOrder?.assignee?.name || "None"}</p>
                </div>

                {/* Coordinates */}
                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Coordinates</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs text-muted-foreground">Lat</p>
                            <p className="text-xs font-mono text-foreground">{selectedOrder.latitude?.toFixed(4) || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Lng</p>
                            <p className="text-xs font-mono text-foreground">{selectedOrder.longitude?.toFixed(4) || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Custom Coordinates */}
                <form id="update-coordinate-form" className="bg-primary/10 rounded-lg p-3 space-y-2" action={handleFormSubmit}>
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Custom Location</p>
                    <Input hidden type="text" name='orderId' value={selectedOrder.id} readOnly />
                    <Input
                        type="number"
                        step="0.0001"
                        name='latitude'
                        placeholder="Latitude"
                        className="w-full px-2 py-1.5 bg-white/10 border border-primary/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs"
                    />
                    <Input
                        type="number"
                        step="0.0001"
                        name='longitude'
                        placeholder="Longitude"
                        className="w-full px-2 py-1.5 bg-white/10 border border-primary/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs"
                    />
                </form>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                    <Button
                        type="submit"
                        form='update-coordinate-form'
                        className="w-full bg-primary hover:bg-primary/90 text-white text-sm h-8 cursor-pointer"
                        disabled={isPending}
                    >
                        Relocate
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DetailsOpen