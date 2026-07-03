"use client"

import { useMapContext } from '@/context/MapCtx';
import maplibregl, { LngLatBoundsLike, Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from "react";


export default function AdminMap() {
    //get the map locations
    const { locations } = useMapContext();

    //create a ref for the map container and map instance
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);

    //initialize the map and set the bounds to kuwait
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const kuwaitBounds: LngLatBoundsLike = [
            [46.5, 28.4],
            [49.0, 30.1],
        ];

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current!, // <-- FIXED
            style: '/api/map',
            center: [48.085369, 29.215606],
            zoom: 0,
            maxBounds: kuwaitBounds,
        });


        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const orderLocations = locations.flatMap(location => {
            //check if the location has coordinates
            if (!location.coordinates || !location.coordinates.lat || !location.coordinates.lon) return [];

            return {
                order_id: location.order_id,
                address: location.address,
                lat: location.coordinates.lat,
                lon: location.coordinates.lon,
            };
        })

        orderLocations.forEach(location => {
            const order_id = location.order_id || 'N/A';
            const address = `Block: ${location.address.block || 'N/A'}, Street: ${location.address.street || 'N/A'}, House: ${location.address.house || 'N/A'}`;
            new Marker()
                .setLngLat([location.lon, location.lat])
                .setPopup(MapPopup({ order_id, address }))
                .addTo(mapRef.current!);
        });

    }, [locations]);

    return (
        <div className="relative w-full h-[420px] z-10">
            <div ref={mapContainerRef} className='z-0 h-full w-full rounded' />
        </div>
    );
};


function MapPopup(data?: { order_id?: string | number, address?: string }) {
    const popup = new maplibregl.Popup().setHTML(
        `<div>
            <h4 class="text-base font-bold text-gray-800 mb-2">Order Details</h3>
            <p class="text-sm text-gray-600">Order ID: ${data?.order_id || 'N/A'}</p>
            <p class="text-sm text-gray-600">Address: ${data?.address || 'Unknown'}</p>
        </div>`
    )

    return popup
}
