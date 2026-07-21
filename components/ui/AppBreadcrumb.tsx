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
    const pathArray = pathname.split('/');
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className={pathArray.length === 1 ? 'hidden' : 'block'}>
                    <Link href="/merchant/dashboard">
                        <Home className="text-muted-foreground w-4 h-4 md:w-6 md:h-6" />
                    </Link>
                </BreadcrumbItem>
                {
                    pathArray.map((path, index) => {
                        if (path === '') return null;
                        return (
                            <React.Fragment key={path}>
                                <BreadcrumbSeparator className={pathArray.length === 1 ? 'hidden' : 'block'} />
                                <BreadcrumbItem className={index === pathArray.length - 1 ? 'text-primary' : ''}>
                                    <Link href={`/${path}`} >{capitalize(path)}</Link>
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