'use client'

import { Button } from "@/components/shadcn/button";
import { PanelRight, X } from "lucide-react";
import { useState } from "react";
import MapSiderbarContent from "./map-sidebar-content";

function MapSiderbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="bg-background/95 backdrop-blur-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <PanelRight className="h-4 w-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div
        className={`absolute top-0 right-0 h-full w-3/5 md:w-96 bg-sidebar z-20 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col items-start p-4 border-b">
          <Button variant="ghost" size="icon" className="ml-auto mb-6" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
          <MapSiderbarContent />
        </div>
      </div>
    </>
  )
}

export default MapSiderbar