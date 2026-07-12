import AppSidebar from '@/components/ui/AppSidebar';
import React from 'react';
import { Separator } from "@/components/shadcn/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/shadcn/sidebar";
import AppBreadcrumb from '@/components/ui/AppBreadcrumb';
import { Toaster } from "react-hot-toast";
import { getServerSessionContext } from '@/lib/checkServerAuth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function MerchantDashLayout({ children }: { children: React.ReactNode }) {
    const { role } = await getServerSessionContext();

    if (role === 'driver') {
        redirect('/driver/dashboard');
    }

    if (role !== 'merchant' && role !== 'clerk') {
        redirect('/login');
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className='overflow-hidden px-4 max-h-screen'>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <AppBreadcrumb />
                    </div>
                </header>
                {children}
                <div id='modal-root'></div>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MerchantDashLayout