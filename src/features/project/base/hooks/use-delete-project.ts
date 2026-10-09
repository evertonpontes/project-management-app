"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { deleteProjectAction } from "../actions";
import { deleteProject } from "../types";

export function useDeleteProject(
    projectId: string = "",
    workspaceId?: string,
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(deleteProjectAction, zodResolver(deleteProject), {
        formProps: {
            defaultValues: {
                id: projectId,
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Project deleted successfully!");
                if (workspaceId) {
                    queryClient.invalidateQueries({
                        queryKey: ["projects", workspaceId],
                    });
                }
                queryClient.invalidateQueries({ queryKey: ["projects"] });
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to delete project. Please try again."
                );
            },
        },
    });
}
