import {
    SidebarMenu,
    SidebarMenuItem
} from "@/components/shadcn/sidebar"
import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import NavItem from "./NavItem"

interface MainNavProps {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[],
}

function MainNav({ items }: MainNavProps) {
    return (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title} >
                    <Link href={item.url} className="flex justify-center">
                        <NavItem text={item.title}>
                            {item.icon && <item.icon />}
                        </NavItem>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}

export default MainNav
