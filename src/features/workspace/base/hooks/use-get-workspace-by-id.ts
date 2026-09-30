"use client";

import { useQuery } from "@tanstack/react-query";
import { getWorkspaceById } from "../query";

export function useGetWorkspaceById(id: string) {
    return useQuery({
        queryKey: ["workspaces", id],
        queryFn: () => getWorkspaceById(id),
        enabled: Boolean(id),
    });
}

export const useGetWorkspace = useGetWorkspaceById;
