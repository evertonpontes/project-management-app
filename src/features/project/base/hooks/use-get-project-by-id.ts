"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../query";
import type { ProjectItem } from "../types";

export function useGetProjectById(
    projectId?: string,
    workspaceId?: string,
    initialData?: ProjectItem
) {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId!, workspaceId),
        enabled: Boolean(projectId),
        initialData,
    });
}

export const useGetProject = useGetProjectById;
