"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { updateSubtaskAction } from "../actions";
import { updateSubtask, type UpdateSubtaskInput } from "../types";

export function useUpdateSubtask(
    initialValues?: Partial<UpdateSubtaskInput>,
    taskId?: string,
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(updateSubtaskAction, zodResolver(updateSubtask), {
        formProps: {
            defaultValues: {
                id: initialValues?.id ?? "",
                taskId: initialValues?.taskId ?? taskId ?? "",
                title: initialValues?.title ?? "",
                isCompleted: initialValues?.isCompleted,
                order: initialValues?.order,
                startDate: initialValues?.startDate,
                dueDate: initialValues?.dueDate,
            },
        },
        actionProps: {
            onSuccess: ({ data, input }) => {
                toast.success("Subtask updated successfully!");
                const targetTaskId =
                    (data as { subtask?: { taskId?: string } } | undefined)
                        ?.subtask?.taskId ||
                    (input as { taskId?: string } | undefined)?.taskId ||
                    taskId ||
                    initialValues?.taskId;

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
                        "Failed to update subtask. Please try again."
                );
            },
        },
    });
}
