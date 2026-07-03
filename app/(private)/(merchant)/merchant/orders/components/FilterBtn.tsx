'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu"
import { ListFilter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation";

type SortType = 'default' | 'city_asc' | 'city_desc'


function FilterBtn() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //function to set the 
    const handleSortFilter = (type: SortType) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type === 'default') { params.delete('sort') } else { params.set('sort', type); }

        router.push(`?${params.toString()}`);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border h-9 px-3 rounded-md">
                <ListFilter className="h-4 w-4" />
                Filters
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSortFilter('default')}>Default</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortFilter('city_asc')}>City (Asc) </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortFilter('city_desc')}>City (Desc)</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FilterBtn