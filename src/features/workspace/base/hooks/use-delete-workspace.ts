"use client"

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { deleteWorkspaceAction } from "../actions";
import { deleteWorkspace } from "../types";

export function useDeleteWorkspace(
    workspaceId: string,
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(deleteWorkspaceAction, zodResolver(deleteWorkspace), {
        formProps: {
            defaultValues: {
                id: workspaceId,
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("Workspace deleted successfully!");
                queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] });
                router.refresh();
            },
            onError: ({ error }) => {
                toast.error(error.serverError?.message || "Failed to delete workspace. Please try again.");
            },
        },
    });
}
