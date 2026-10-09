"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../query";
import type { TaskFilters, TaskPaginationInput } from "../types";

export function useGetTasks(
    projectId: string,
    filters?: TaskFilters,
    pagination?: TaskPaginationInput
) {
    return useQuery({
        queryKey: [
            "tasks",
            projectId,
            filters?.status,
            filters?.type,
            filters?.priority,
            filters?.search,
            pagination?.page,
            pagination?.rowSize,
        ],
        queryFn: () => getTasks(projectId, filters, pagination),
        enabled: Boolean(projectId),
    });
}
