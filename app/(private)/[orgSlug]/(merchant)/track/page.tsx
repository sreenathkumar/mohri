import { getOwnerMapData } from "@/actions/mapActions";
import { MapProvider } from "@/context/MapCtx";
import Map from "./components/map";

async function RealtimeLocationPage() {
    const ownerMapData = await getOwnerMapData();
    return (
        <div className="w-full relative">
            <MapProvider>
                <Map orders={ownerMapData} />
            </MapProvider>
        </div>
    )
}

export default RealtimeLocationPage