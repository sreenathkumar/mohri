'use client'

import dynamic from "next/dynamic"

// Dynamically import the Map component with no SSR to avoid issues with window object
const AdminMap = dynamic(() => import("./admin-map"), { ssr: false })

function Map() {
    return (
        <div className="flex-1 relative">
            <AdminMap />
        </div>
    )
}

export default Map