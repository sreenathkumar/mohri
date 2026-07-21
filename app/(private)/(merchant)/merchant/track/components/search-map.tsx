'use client'

import { Input } from "@/components/shadcn/input"
import { Button } from "@/components/shadcn/button"
import { Search } from "lucide-react"
import { useState } from "react"

function SearchMap() {
  const [searchQuery, setSearchQuery] = useState("");

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Here you would implement the actual search functionality
  //   console.log("Searching for:", searchQuery)
  // }
  return (
    <div className="flex gap-3 flex-1 z-20">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search locations..."
          className="pl-11 h-11 bg-card border-border rounded-xl focus-visible:ring-ring"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-5 rounded-xl shadow-lg shadow-primary/10 transition-all duration-300 gap-2">Search</Button>
    </div>
  )
}

export default SearchMap