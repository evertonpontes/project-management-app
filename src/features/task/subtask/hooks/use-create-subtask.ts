"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createSubtaskAction } from "../actions";
import { createSubtask, type CreateSubtaskInput } from "../types";

export function useCreateSubtask(
    initialValues?: Partial<CreateSubtaskInput>,
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(createSubtaskAction, zodResolver(createSubtask), {
        formProps: {
            defaultValues: {
                taskId: initialValues?.taskId ?? "",
                title: initialValues?.title ?? "",
                isCompleted: initialValues?.isCompleted ?? false,
                order: initialValues?.order,
                startDate: initialValues?.startDate,
                dueDate: initialValues?.dueDate,
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Subtask added successfully!");
                if (initialValues?.taskId) {
                    queryClient.invalidateQueries({
                        queryKey: ["subtasks", initialValues.taskId],
                    });
                }
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to add subtask. Please try again."
                );
            },
        },
    });
}
