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
      <div className="relative flex-1 gap-3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search locations..."
          className="pl-8 bg-background/95 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
    </div>
  )
}

export default SearchMap