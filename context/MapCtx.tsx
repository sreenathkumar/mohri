'use client'

import { createContext, useContext, useState } from "react";

interface MapContextType {
    selectedOrderId: number | null;
    setSelectedOrderId: React.Dispatch<React.SetStateAction<number | null>>;
    mapRef: maplibregl.Map | null;
    setMapRef: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
}

const MapCtx = createContext<MapContextType | null>(null);

export function useMapContext() {
    const context = useContext(MapCtx);

    if (!context) {
        throw new Error("useMapContext must be used within a MapProvider");
    }

    return context;
}

export function MapProvider({ children, }: { children: React.ReactNode }) {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [mapRef, setMapRef] = useState<maplibregl.Map | null>(null);

    return <MapCtx.Provider value={{ selectedOrderId, setSelectedOrderId, mapRef, setMapRef }}>
        {children}
    </MapCtx.Provider>
}
