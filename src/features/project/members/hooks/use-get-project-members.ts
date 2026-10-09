"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../query";
import type { PaginationInput } from "@/features/project/base/types";

export function useGetProjectMembers(
    projectId: string,
    pagination?: PaginationInput
) {
    return useQuery({
        queryKey: [
            "project-members",
            projectId,
            pagination?.page,
            pagination?.rowSize,
        ],
        queryFn: () => getProjectMembers(projectId, pagination),
        enabled: Boolean(projectId),
    });
}
