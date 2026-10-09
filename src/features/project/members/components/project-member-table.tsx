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

import { ProjectMemberItem } from "../types";
import { createProjectMemberColumns } from "./project-member-columns";
import { ProjectMemberTableToolbar } from "./project-member-table-toolbar";
import { ProjectMemberPagination } from "./project-member-pagination";

export interface ProjectMemberTableProps {
    data: ProjectMemberItem[];
    isLoading?: boolean;
    pageSize?: number;
    onRoleChange?: (member: ProjectMemberItem, newRole: string) => void;
    onRemoveMember?: (member: ProjectMemberItem) => void;
    currentUserId?: string;
    className?: string;
}

export function ProjectMemberTable({
    data,
    isLoading = false,
    pageSize = 10,
    onRoleChange,
    onRemoveMember,
    currentUserId,
    className = "",
}: ProjectMemberTableProps) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize,
    });

    const columns = useMemo(
        () =>
            createProjectMemberColumns({
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
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = String(filterValue).toLowerCase().trim();
            if (!search) return true;

            const member = row.original;
            const name = (member.user?.name || "").toLowerCase();
            const email = (member.user?.email || "").toLowerCase();
            const role = (member.role || "").toLowerCase();

            return (
                name.includes(search) ||
                email.includes(search) ||
                role.includes(search)
            );
        },
    });

    const filteredRows = table.getFilteredRowModel().rows;
    const totalRows = filteredRows.length;
    const totalPages = table.getPageCount();
    const currentPage = pagination.pageIndex + 1;

    return (
        <div className={`space-y-4 ${className}`} data-slot="project-member-table">
            {/* Search Toolbar */}
            <ProjectMemberTableToolbar
                value={globalFilter}
                onChange={setGlobalFilter}
            />

            {/* Table Container */}
            <div className="bg-card border border-border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="rounded-full size-8" />
                                            <div className="space-y-1.5">
                                                <Skeleton className="w-28 h-4" />
                                                <Skeleton className="w-40 h-3" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="rounded-full w-16 h-5" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-24 h-4" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="ml-auto rounded-md size-7" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
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
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-48 text-center"
                                >
                                    <div className="flex flex-col justify-center items-center gap-2 py-6 text-muted-foreground">
                                        <RiTeamLine className="stroke-1 size-10 text-muted-foreground/60" />
                                        <div className="font-medium text-foreground text-sm">
                                            {globalFilter
                                                ? "No matching project members found"
                                                : "No members found in this project"}
                                        </div>
                                        <p className="max-w-sm text-muted-foreground text-xs">
                                            {globalFilter
                                                ? `No results for "${globalFilter}". Try adjusting your search query.`
                                                : "Add team members to this project to start collaborating on tasks."}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination & Stats */}
            <ProjectMemberPagination
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

export default ProjectMemberTable;
