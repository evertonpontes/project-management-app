"use client";

import * as React from "react";
import { RiCloseLine, RiFilter3Line, RiSearchLine } from "@remixicon/react";
import { TaskPriority, TaskStatus, TaskTypes } from "@/generated/prisma/enums";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import type { TaskFilters } from "../types";
import {
    TASK_PRIORITY_OPTIONS,
    TASK_STATUS_OPTIONS,
    TASK_TYPE_OPTIONS,
} from "../types";

interface TaskFiltersToolbarProps {
    filters: TaskFilters;
    onFiltersChange: (filters: TaskFilters) => void;
}

export function TaskFiltersToolbar({
    filters,
    onFiltersChange,
}: TaskFiltersToolbarProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            search: e.target.value,
        });
    };

    const handleClearSearch = () => {
        onFiltersChange({
            ...filters,
            search: "",
        });
    };

    const activeFilterCount =
        (filters.status && filters.status !== "ALL" ? 1 : 0) +
        (filters.priority && filters.priority !== "ALL" ? 1 : 0) +
        (filters.type && filters.type !== "ALL" ? 1 : 0);

    const handleClearAllFilters = () => {
        onFiltersChange({
            search: filters.search,
            status: "ALL",
            priority: "ALL",
            type: "ALL",
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative sm:w-64 min-w-44">
                <RiSearchLine className="top-1/2 left-2.5 absolute size-4 text-muted-foreground -translate-y-1/2" />
                <Input
                    placeholder="Search tasks..."
                    value={filters.search || ""}
                    onChange={handleSearchChange}
                    className="bg-background pr-7 pl-8 h-9 text-xs"
                />
                {filters.search && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="top-1/2 right-2 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                    >
                        <RiCloseLine className="size-3.5" />
                    </button>
                )}
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 h-9 font-medium text-xs cursor-pointer"
                        >
                            <RiFilter3Line className="size-3.5 text-muted-foreground" />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="ml-1 px-1.5 py-0 rounded-full h-4 text-[10px]"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    }
                />
                <DropdownMenuContent align="end" className="w-56">
                    <div className="flex justify-between items-center px-2 py-1.5">
                        <span className="font-semibold text-xs">
                            Filter by Status
                        </span>
                        {filters.status && filters.status !== "ALL" && (
                            <button
                                type="button"
                                onClick={() =>
                                    onFiltersChange({
                                        ...filters,
                                        status: "ALL",
                                    })
                                }
                                className="text-[10px] text-muted-foreground hover:text-foreground"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() =>
                                onFiltersChange({ ...filters, status: "ALL" })
                            }
                            className={
                                !filters.status || filters.status === "ALL"
                                    ? "font-semibold"
                                    : ""
                            }
                        >
                            All Statuses
                        </DropdownMenuItem>
                        {TASK_STATUS_OPTIONS.map((item) => (
                            <DropdownMenuItem
                                key={item.value}
                                onClick={() =>
                                    onFiltersChange({
                                        ...filters,
                                        status: item.value as TaskStatus,
                                    })
                                }
                                className={
                                    filters.status === item.value
                                        ? "font-semibold bg-accent"
                                        : ""
                                }
                            >
                                <span
                                    className={`size-2 rounded-full ${item.color} mr-2`}
                                />
                                <span>{item.label}</span>
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />

                        <div className="flex justify-between items-center px-2 py-1.5">
                            <span className="font-semibold text-xs">
                                Filter by Priority
                            </span>
                            {filters.priority && filters.priority !== "ALL" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onFiltersChange({
                                            ...filters,
                                            priority: "ALL",
                                        })
                                    }
                                    className="text-[10px] text-muted-foreground hover:text-foreground"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                        <DropdownMenuItem
                            onClick={() =>
                                onFiltersChange({ ...filters, priority: "ALL" })
                            }
                            className={
                                !filters.priority || filters.priority === "ALL"
                                    ? "font-semibold"
                                    : ""
                            }
                        >
                            All Priorities
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        {TASK_PRIORITY_OPTIONS.map((item) => (
                            <DropdownMenuItem
                                key={item.value}
                                onClick={() =>
                                    onFiltersChange({
                                        ...filters,
                                        priority: item.value as TaskPriority,
                                    })
                                }
                                className={
                                    filters.priority === item.value
                                        ? "font-semibold bg-accent"
                                        : ""
                                }
                            >
                                <span
                                    className={`size-2 rounded-full ${item.color} mr-2`}
                                />
                                <span>{item.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>

                    <DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="font-semibold text-xs">
                            Filter by Type
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                onFiltersChange({ ...filters, type: "ALL" })
                            }
                            className={
                                !filters.type || filters.type === "ALL"
                                    ? "font-semibold"
                                    : ""
                            }
                        >
                            All Types
                        </DropdownMenuItem>
                        {TASK_TYPE_OPTIONS.map((item) => (
                            <DropdownMenuItem
                                key={item.value}
                                onClick={() =>
                                    onFiltersChange({
                                        ...filters,
                                        type: item.value as TaskTypes,
                                    })
                                }
                                className={
                                    filters.type === item.value
                                        ? "font-semibold bg-accent"
                                        : ""
                                }
                            >
                                {item.label}
                            </DropdownMenuItem>
                        ))}

                        {activeFilterCount > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleClearAllFilters}
                                    className="justify-center font-medium text-destructive text-xs"
                                >
                                    Clear all filters
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
