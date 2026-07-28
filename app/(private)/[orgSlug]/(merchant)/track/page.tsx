import { getMarchantMapData } from "@/actions/mapActions";
import { MapProvider } from "@/context/MapCtx";
import Map from "./components/map";

async function RealtimeLocationPage() {
    const merchantMapData = await getMarchantMapData();
    return (
        <div className="w-full relative">
            <MapProvider>
                <Map orders={merchantMapData} />
            </MapProvider>
        </div>
    )
}

export default RealtimeLocationPage