'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/shadcn/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface OrderPaginationProps {
    totalPages: number;
    maxVisiblePages?: number;
}

function OrderPagination({ totalPages, maxVisiblePages = 5 }: OrderPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const updateParam = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set('page', value);
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };
    const pages = [];

    // Scenario 1: Total pages are small, just render all of them
    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        size={'sm'}
                        isActive={currentPage === i}
                        onClick={() => updateParam(i.toString())}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    } else {
        // Scenario 2: Large number of pages, handle with smart ellipsis boundaries

        // 1. Always display the very first page
        pages.push(
            <PaginationItem key={1}>
                <PaginationLink
                    size={'sm'}
                    isActive={currentPage === 1}
                    onClick={() => updateParam('1')}
                    className="cursor-pointer"
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        // 2. Render Left Ellipsis if current page is far enough from the start
        if (currentPage > 3) {
            pages.push(
                <PaginationItem key="left-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // 3. Render middle sibling pages (current page, one before, and one after)
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        size={'sm'}
                        isActive={currentPage === i}
                        onClick={() => updateParam(i.toString())}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // 4. Render Right Ellipsis if current page is far enough from the end
        if (currentPage < totalPages - 2) {
            pages.push(
                <PaginationItem key="right-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // 5. Always display the very last page
        pages.push(
            <PaginationItem key={totalPages}>
                <PaginationLink
                    size={'sm'}

                    isActive={currentPage === totalPages}
                    onClick={() => updateParam(totalPages.toString())}
                    className="cursor-pointer"
                >
                    {totalPages}
                </PaginationLink>
            </PaginationItem>
        );
    }

    // Single return wrapper ensures Shadcn layout is ALWAYS applied
    return (
        <Pagination className="justify-center mt-4">
            <PaginationContent>
                {currentPage > 1 && <PaginationPrevious
                    onClick={() => updateParam((currentPage - 1).toString())}
                />}
                {pages}
                {currentPage < totalPages && <PaginationNext
                    onClick={() => updateParam((currentPage + 1).toString())}
                />}
            </PaginationContent>
        </Pagination>
    );
};

export default OrderPagination;