'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/shadcn/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/shadcn/sidebar";

import UserMenu from "./UserMenu";
import { ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";

function User() {
    const { isMobile } = useSidebar();
    const { data: session } = useSession();
    if (!session) return null;

    const userName = session?.user.name;
    const userEmail = session?.user.email;
    const userImage = session?.user.image;

    // console.log('user in client: ', session.user);
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=closed]:p-2"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={userImage} alt={userName} />
                                <AvatarFallback className="rounded-lg bg-background">{userName[0]?.toLocaleUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{userName}</span>
                                <span className="truncate text-xs">{userEmail}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <UserMenu userName={userName} userEmail={userEmail} userImage={userImage} isMobile={isMobile} />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default User