import { Separator } from "@/components/shadcn/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/shadcn/sidebar";
import AppBreadcrumb from '@/components/ui/AppBreadcrumb';
import AppSidebar from '@/components/ui/AppSidebar';
import VerifyEmailTemplate from "@/lib/email/templates/email-verification";
import React from 'react';
import { Toaster } from "react-hot-toast";

export const dynamic = 'force-dynamic';

async function MerchantDashLayout({ children }: { children: React.ReactNode }) {
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