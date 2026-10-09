"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createTaskAction } from "../actions";
import { createTask } from "../types";
import { TaskPriority, TaskStatus, TaskTypes } from "@/generated/prisma/enums";

export function useCreateTask(
    projectId: string = "",
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(createTaskAction, zodResolver(createTask), {
        formProps: {
            defaultValues: {
                title: "",
                description: "",
                projectId,
                type: TaskTypes.TASK,
                status: TaskStatus.TODO,
                priority: TaskPriority.MEDIUM,
                assignedToId: "",
                dueDate: undefined,
                startDate: undefined,
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Task created successfully!");
                queryClient.invalidateQueries({
                    queryKey: ["tasks", projectId],
                });
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
                queryClient.invalidateQueries({ queryKey: ["project", projectId] });
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to create task. Please try again."
                );
            },
        },
    });
}
