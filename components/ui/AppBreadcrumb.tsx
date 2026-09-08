'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/shadcn/breadcrumb";
import { capitalize } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function AppBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className={segments.length === 0 ? 'hidden' : 'block'}>
                    <Link href="/merchant/dashboard">
                        <Home className="text-muted-foreground w-4 h-4 md:w-6 md:h-6" />
                    </Link>
                </BreadcrumbItem>
                {
                    segments.map((segment, index) => {
                        const href = '/' + segments.slice(0, index + 1).join('/');
                        const isLast = index === segments.length - 1;

                        return (
                            <React.Fragment key={href}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className={isLast ? 'text-primary' : ''}>
                                    <Link href={href}>{capitalize(segment)}</Link>
                                </BreadcrumbItem>
                            </React.Fragment>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default AppBreadcrumb