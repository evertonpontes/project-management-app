"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createProjectAction } from "../actions";
import { createProject } from "../types";

export function useCreateProject(
    workspaceId: string = "",
    onSuccessCallback?: () => void
) {
    const queryClient = useQueryClient();

    return useHookFormAction(createProjectAction, zodResolver(createProject), {
        formProps: {
            defaultValues: {
                name: "",
                workspaceId,
                startDate: new Date(),
                dueDate: new Date(),
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Project created successfully!");
                queryClient.invalidateQueries({
                    queryKey: ["projects", workspaceId],
                });
                queryClient.invalidateQueries({ queryKey: ["projects"] });
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(
                    error.serverError?.message ||
                        "Failed to create project. Please try again."
                );
            },
        },
    });
}
