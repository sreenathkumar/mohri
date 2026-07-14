import { getServerSessionContext } from "@/lib/checkServerAuth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/sidebar"
import { IdCard, LayoutDashboard, Package, Truck, Store } from 'lucide-react'
import MainNav from "./MainNav"
import User from "./User"
import { redirect } from "next/navigation"
import Image from "next/image"
import AppIcon from "@/app/icon.svg"

const navItems = [
  { title: "Dashboard", url: "/merchant/dashboard", icon: LayoutDashboard },
  { title: "Stores", url: "/merchant/stores", icon: Store, requires: ['merchant', 'clerk'] },
  { title: "Employees", url: "/merchant/employees", icon: IdCard, requires: ['merchant'] },
  { title: "Orders", url: "/merchant/orders", icon: Package },
  { title: 'Track Delivery', url: '/merchant/track', icon: Truck },
]

async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role, userId } = await getServerSessionContext();

  if (!role || !userId) {
    redirect('/login') // Redirect to login if the user is not authenticated
  }

  const filteredNavItems = navItems.filter((item) => {
    // Include the item if no role is required, or if the user's role matches the required role
    return !item.requires || item.requires.includes(role || 'guest');
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-6 border-b mb-6">
        <Image
          src={AppIcon}
          alt="Company Logo"
          width={48}
          height={24}
          className="object-contain"
          priority
        />
      </SidebarHeader>
      <SidebarContent>
        <MainNav items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        {userId && <User />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar