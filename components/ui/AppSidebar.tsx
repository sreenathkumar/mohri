import { auth } from "@/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/sidebar"
import { HelpCircle, IdCard, LayoutDashboard, Package, Truck, Store, BookOpenText } from 'lucide-react'
import MainNav from "./MainNav"
import User from "./User"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Stores", url: "/stores", icon: Store },
  { title: "Employees", url: "/employees", icon: IdCard, requires: ['admin', 'clerk'] },
  { title: "Orders", url: "/orders", icon: Package },
  { title: 'Track Delivery', url: '/track', icon: Truck },
  { title: "Privacy Policy", url: "/privacy-policy", icon: BookOpenText },
  { title: "Help", url: "/help", icon: HelpCircle },
]

async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  if (!session) {
    return null;
  }
  const user = session.user;

  const filteredNavItems = navItems.filter((item) => {
    // Include the item if no role is required, or if the user's role matches the required role
    return !item.requires || item.requires.includes(user.role || 'guest');
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
        {user && <User />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar