import { getServerSessionContext } from "@/lib/checkServerAuth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/sidebar"
import { HelpCircle, IdCard, LayoutDashboard, Package, Truck, Store } from 'lucide-react'
import MainNav from "./MainNav"
import User from "./User"
import { redirect } from "next/navigation"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Stores", url: "/stores", icon: Store, requires: ['merchant', 'clerk'] },
  { title: "Employees", url: "/employees", icon: IdCard, requires: ['merchant', 'clerk'] },
  { title: "Orders", url: "/orders", icon: Package },
  { title: 'Track Delivery', url: '/track', icon: Truck },
  { title: "Help", url: "/help", icon: HelpCircle },
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
        Logo
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