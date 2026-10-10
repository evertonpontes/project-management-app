"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { deleteSubtaskAction } from "../actions";
import { deleteSubtask, type DeleteSubtaskInput } from "../types";

export function useDeleteSubtask(
    initialValues?: Partial<DeleteSubtaskInput>,
    taskId?: string,
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(deleteSubtaskAction, zodResolver(deleteSubtask), {
        formProps: {
            defaultValues: {
                id: initialValues?.id ?? "",
                taskId: initialValues?.taskId ?? taskId ?? "",
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Subtask deleted successfully!");
                const targetTaskId = initialValues?.taskId || taskId;
                if (targetTaskId) {
                    queryClient.invalidateQueries({
                        queryKey: ["subtasks", targetTaskId],
                    });
                }
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to delete subtask. Please try again."
                );
            },
        },
    });
}
