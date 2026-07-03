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
                <BreadcrumbItem className="hidden md:block">
                    <Link href="/merchant/dashboard">
                        <Home />
                    </Link>
                </BreadcrumbItem>
                {
                    pathArray.map((path) => {
                        if (path === '') return null;
                        return (
                            <React.Fragment key={path}>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <Link href={`/${path}`}>{capitalize(path)}</Link>
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