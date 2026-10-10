"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubtasks } from "../query";
import type { SubtaskItem } from "../types";

export function useGetSubtasks(
    taskId: string,
    initialData?: SubtaskItem[]
) {
    return useQuery({
        queryKey: ["subtasks", taskId],
        queryFn: () => getSubtasks(taskId),
        enabled: Boolean(taskId),
        initialData,
        initialDataUpdatedAt: 0,
    });
}
