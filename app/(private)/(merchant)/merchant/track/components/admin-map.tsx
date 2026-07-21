"use client"

import { useMapContext } from '@/context/MapCtx';
import { MapPageOrderType } from '@/types/OrderType';
import maplibregl, { LngLatBounds, Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from "react";

interface PopupData {
    order_id: string | number;
    address: string;
    driver?: string;
}

const createPopupHtml = ({ order_id, address, driver }: PopupData): string => `
     <div class="popup-content-header"> 
          <p class="text-xs uppercase tracking-widest font-bold text-primary">Order ID</p>
          <p class="text-sm font-semibold text-foreground mt-1">${order_id}</p>
      </div>
    
    <div class="space-y-2 p-4">
      <div class="bg-white/5 rounded-lg p-3 border border-white/10"><div class="flex items-center gap-2 mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin w-4 h-4 text-muted-foreground" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg><p class="text-xs uppercase text-muted-foreground font-semibold">Delivery Address</p></div><p class="text-sm text-foreground leading-relaxed">${address}</p></div>
      <div class="bg-white/5 rounded-lg p-3 border border-white/10"><p class="text-xs uppercase text-muted-foreground font-semibold mb-1">Assignee</p><p class="text-xs font-medium text-foreground truncate">${driver || 'Not assigned'}</p></div>
    </div>
  
`;

export default function AdminMap({ orders }: { orders: MapPageOrderType[] }) {
    const { setMapRef } = useMapContext()
    // Core DOM and Map Instance Refs
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);

    // Tracks active markers to safely clear them before updates
    const activeMarkersRef = useRef<Marker[]>([]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const mapInstance = new maplibregl.Map({
            container: mapContainerRef.current,
            style: '/api/map',
            center: [48.085369, 29.215606],
        });

        mapRef.current = mapInstance;

        mapInstance.on('load', () => {
            setMapRef(mapInstance)
        });

        // Cleanup: Tear down the map entirely on unmount
        return () => {
            mapInstance.remove();
            mapRef.current = null;
            setMapRef(null)
        };
    }, [setMapRef]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Remove existing markers from map & clear storage array
        activeMarkersRef.current.forEach(marker => marker.remove());
        activeMarkersRef.current = [];

        const bounds = new LngLatBounds();
        let hasValidCoordinates = false;

        // Iterate and draw fresh markers
        orders.forEach(order => {
            const lat = order.latitude;
            const lon = order.longitude;

            if (typeof lat !== 'number' || typeof lon !== 'number') return;

            const order_id = order.id ?? 'N/A';


            // Create customizable popup instance
            const popup = new maplibregl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: true
            }).setHTML(createPopupHtml({ order_id, address: order.address }));

            // Create and bind marker to map
            const marker = new Marker({ color: '#EF4444' })
                .setLngLat([lon, lat])
                .setPopup(popup)
                .addTo(map);

            // Track reference for later cleanup
            activeMarkersRef.current.push(marker);

            // Expand boundary map frame
            bounds.extend([lon, lat]);
            hasValidCoordinates = true;
        });

        // Zoom smoothly to encapsulate all plotted locations
        if (hasValidCoordinates) {
            // Wait slightly for map to finish loading its style sheets safely
            if (map.loaded()) {
                map.fitBounds(bounds, { padding: 60, maxZoom: 5 });
            } else {
                map.once('load', () => {
                    map.fitBounds(bounds, { padding: 60, maxZoom: 5 });
                });
            }
        }

    }, [orders]);

    return (
        <div className="relative w-full h-[calc(100vh-184px)] z-10 overflow-hidden shadow-inner lg:h-[calc(100vh-80px)]">
            <div
                ref={mapContainerRef}
                className="w-full h-full z-0 rounded-md transition-opacity duration-300 ease-in-out"
            />
        </div>
    );
}
