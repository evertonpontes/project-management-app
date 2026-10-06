"use client"

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { updateWorkspaceAction } from "../actions";
import { updateWorkspace, type UpdateWorkspaceInput } from "../types";

export function useUpdateWorkspace(
    workspaceId: string,
    initialValues?: Partial<UpdateWorkspaceInput>
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(updateWorkspaceAction, zodResolver(updateWorkspace), {
        formProps: {
            defaultValues: {
                id: workspaceId,
                name: initialValues?.name ?? "",
                description: initialValues?.description ?? "",
                avatarUrl: initialValues?.avatarUrl ?? "",
                key: initialValues?.key ?? "",
                ...initialValues,
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Workspace updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] });
                router.refresh();
            },
            onError: ({ error }) => {
                toast.error(error.serverError?.message || "Failed to update workspace. Please try again.");
            },
        },
    });
}
