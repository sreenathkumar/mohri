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
import { getServerSession } from "@/lib/auth-context"
import Link from "next/link"


async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login') // Redirect to login if the user is not authenticated
  }
  const userId = session?.session.userId;

  const navItems = [
    { title: "Dashboard", url: 'dashboard', icon: LayoutDashboard },
    { title: "Stores", url: "stores", icon: Store, },
    { title: "Employees", url: "employees", icon: IdCard, },
    { title: "Orders", url: "orders", icon: Package },
    { title: 'Track Delivery', url: 'track', icon: Truck },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-6 border-b mb-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={AppIcon}
            alt="Company Logo"
            width={48}
            height={24}
            className="object-contain"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <MainNav items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {userId && <User />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar