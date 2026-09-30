"use client";

import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "../query";
import type { PaginationInput } from "../types";

export function useGetWorkspaces(params: PaginationInput = {}) {
    return useQuery({
        queryKey: ["workspaces", params],
        queryFn: () => getWorkspaces(params),
    });
}
