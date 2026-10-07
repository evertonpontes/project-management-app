"use client";

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export interface WorkspaceMemberPaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRows: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onPageSelect?: (page: number) => void;
    className?: string;
}

export function WorkspaceMemberPagination({
    currentPage,
    totalPages,
    pageSize,
    totalRows,
    canPreviousPage,
    canNextPage,
    onPreviousPage,
    onNextPage,
    onPageSelect,
    className = "",
}: WorkspaceMemberPaginationProps) {
    const from = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalRows);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div
            className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
            data-slot="workspace-member-pagination"
        >
            {/* Total rows & range */}
            <div className="text-xs text-muted-foreground sm:text-sm">
                {totalRows > 0 ? (
                    <span>
                        Showing <strong className="font-medium text-foreground">{from}</strong> to{" "}
                        <strong className="font-medium text-foreground">{to}</strong> of{" "}
                        <strong className="font-medium text-foreground">{totalRows}</strong> {totalRows === 1 ? "member" : "members"}
                    </span>
                ) : (
                    <span>No members to display</span>
                )}
            </div>

            {/* Current page & navigation */}
            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs text-muted-foreground sm:text-sm whitespace-nowrap">
                    Page <strong className="font-medium text-foreground">{totalPages > 0 ? currentPage : 0}</strong> of{" "}
                    <strong className="font-medium text-foreground">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onPreviousPage}
                        disabled={!canPreviousPage}
                        aria-label="Go to previous page"
                        className="h-8 px-2 sm:px-3 text-xs"
                    >
                        <RiArrowLeftSLine className="size-4" data-icon="inline-start" />
                        <span className="hidden sm:inline">Previous</span>
                    </Button>

                    {/* Numeric page buttons if page selector provided and more than 1 page */}
                    {onPageSelect && totalPages > 1 && (
                        <div className="hidden sm:flex items-center gap-1">
                            {pageNumbers.map((page) => (
                                <Button
                                    key={page}
                                    type="button"
                                    variant={page === currentPage ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageSelect(page)}
                                    className="h-8 w-8 p-0 text-xs"
                                    aria-current={page === currentPage ? "page" : undefined}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onNextPage}
                        disabled={!canNextPage}
                        aria-label="Go to next page"
                        className="h-8 px-2 sm:px-3 text-xs"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <RiArrowRightSLine className="size-4" data-icon="inline-end" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
