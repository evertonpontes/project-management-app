"use client";

import { useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { RiTeamLine } from "@remixicon/react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { WorkspaceMemberItem } from "../types";
import { createWorkspaceMemberColumns } from "./workspace-member-columns";
import { WorkspaceMemberTableToolbar } from "./workspace-member-table-toolbar";
import { WorkspaceMemberPagination } from "./workspace-member-pagination";

export interface WorkspaceMemberTableProps {
    data: WorkspaceMemberItem[];
    isLoading?: boolean;
    pageSize?: number;
    onRoleChange?: (member: WorkspaceMemberItem, newRole: string) => void;
    onRemoveMember?: (member: WorkspaceMemberItem) => void;
    currentUserId?: string;
    className?: string;
}

export function WorkspaceMemberTable({
    data,
    isLoading = false,
    pageSize = 10,
    onRoleChange,
    onRemoveMember,
    currentUserId,
    className = "",
}: WorkspaceMemberTableProps) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize,
    });

    const columns = useMemo(
        () =>
            createWorkspaceMemberColumns({
                onRoleChange,
                onRemoveMember,
                currentUserId,
            }),
        [onRoleChange, onRemoveMember, currentUserId]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const search = String(filterValue).toLowerCase().trim();
            if (!search) return true;

            const member = row.original;
            const name = (member.user?.name || "").toLowerCase();
            const email = (member.user?.email || "").toLowerCase();
            const role = (member.role || "").toLowerCase();

            return name.includes(search) || email.includes(search) || role.includes(search);
        },
    });

    const filteredRows = table.getFilteredRowModel().rows;
    const totalRows = filteredRows.length;
    const totalPages = table.getPageCount();
    const currentPage = pagination.pageIndex + 1;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Toolbar */}
            <WorkspaceMemberTableToolbar
                value={globalFilter}
                onChange={setGlobalFilter}
            />

            {/* Table Container */}
            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            // Loading Skeleton
                            Array.from({ length: 4 }).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="size-8 rounded-full" />
                                            <div className="space-y-1.5">
                                                <Skeleton className="h-4 w-28" />
                                                <Skeleton className="h-3 w-40" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="ml-auto size-7 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            // Member Rows
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            // Empty State
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-48 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
                                        <RiTeamLine className="size-10 stroke-1 text-muted-foreground/60" />
                                        <div className="text-sm font-medium text-foreground">
                                            {globalFilter ? "No matching members found" : "No members found"}
                                        </div>
                                        <p className="text-xs text-muted-foreground max-w-sm">
                                            {globalFilter
                                                ? `No results for "${globalFilter}". Try adjusting your search query.`
                                                : "There are no members in this workspace yet. Click the invite button above to invite collaborators."}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination & Stats */}
            <WorkspaceMemberPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pagination.pageSize}
                totalRows={totalRows}
                canPreviousPage={table.getCanPreviousPage()}
                canNextPage={table.getCanNextPage()}
                onPreviousPage={() => table.previousPage()}
                onNextPage={() => table.nextPage()}
                onPageSelect={(page) => table.setPageIndex(page - 1)}
            />
        </div>
    );
}
