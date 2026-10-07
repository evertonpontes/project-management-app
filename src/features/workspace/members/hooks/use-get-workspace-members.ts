"use client";

import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMembers } from "../query";
import { PaginationInput } from "@/features/workspace";

export function useGetWorkspaceMembers(
    workspaceId: string,
    pagination?: PaginationInput
) {
    return useQuery({
        queryKey: ["workspace-members", workspaceId, pagination?.page, pagination?.rowSize],
        queryFn: () => getWorkspaceMembers(workspaceId, pagination),
        enabled: Boolean(workspaceId),
    });
}
