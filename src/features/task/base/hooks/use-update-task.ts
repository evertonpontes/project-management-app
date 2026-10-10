"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { updateTaskAction } from "../actions";
import { updateTask, type UpdateTaskInput } from "../types";

export function useUpdateTask(
    initialValues?: Partial<UpdateTaskInput>,
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(updateTaskAction, zodResolver(updateTask), {
        formProps: {
            defaultValues: {
                id: initialValues?.id ?? "",
                projectId: initialValues?.projectId ?? "",
                title: initialValues?.title ?? "",
                description: initialValues?.description ?? "",
                type: initialValues?.type,
                status: initialValues?.status,
                priority: initialValues?.priority,
                assignedToId: initialValues?.assignedToId ?? "",
                dueDate: initialValues?.dueDate,
                startDate: initialValues?.startDate,
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Task updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
                if (initialValues?.projectId) {
                    queryClient.invalidateQueries({
                        queryKey: ["tasks", initialValues.projectId],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["project", initialValues.projectId],
                    });
                }
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to update task. Please try again."
                );
            },
        },
    });
}
