"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../query";
import type { PaginationInput } from "../types";

export function useGetProjects(
    workspaceId: string,
    pagination?: PaginationInput
) {
    return useQuery({
        queryKey: [
            "projects",
            workspaceId,
            pagination?.page,
            pagination?.rowSize,
        ],
        queryFn: () => getProjects(workspaceId, pagination),
        enabled: Boolean(workspaceId),
    });
}
