"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { updateProjectAction } from "../actions";
import { updateProject, type UpdateProjectInput } from "../types";

export function useUpdateProject(
    initialValues?: Partial<UpdateProjectInput>,
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(updateProjectAction, zodResolver(updateProject), {
        formProps: {
            defaultValues: {
                id: initialValues?.id ?? "",
                workspaceId: initialValues?.workspaceId ?? "",
                name: initialValues?.name ?? "",
                startDate: initialValues?.startDate
                    ? new Date(initialValues.startDate)
                    : new Date(),
                dueDate: initialValues?.dueDate
                    ? new Date(initialValues.dueDate)
                    : new Date(),
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Project updated successfully!");
                if (initialValues?.workspaceId) {
                    queryClient.invalidateQueries({
                        queryKey: ["projects", initialValues.workspaceId],
                    });
                }
                queryClient.invalidateQueries({ queryKey: ["projects"] });
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to update project. Please try again."
                );
            },
        },
    });
}
