"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserTasks } from "../query";
import type { TaskFilters, TaskPaginationInput } from "../types";

export function useGetUserTasks(
    filters?: TaskFilters,
    pagination?: TaskPaginationInput
) {
    return useQuery({
        queryKey: [
            "user-tasks",
            filters?.status,
            filters?.type,
            filters?.priority,
            filters?.search,
            pagination?.page,
            pagination?.rowSize,
        ],
        queryFn: () => getUserTasks(filters, pagination),
    });
}
