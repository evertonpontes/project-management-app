"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { deleteTaskAction } from "../actions";
import { deleteTask, type DeleteTaskInput } from "../types";

export function useDeleteTask(
    initialValues?: Partial<DeleteTaskInput>,
    projectId?: string,
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(deleteTaskAction, zodResolver(deleteTask), {
        formProps: {
            defaultValues: {
                id: initialValues?.id ?? "",
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Task deleted successfully!");
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
                if (projectId) {
                    queryClient.invalidateQueries({
                        queryKey: ["tasks", projectId],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["project", projectId],
                    });
                }
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to delete task. Please try again."
                );
            },
        },
    });
}
