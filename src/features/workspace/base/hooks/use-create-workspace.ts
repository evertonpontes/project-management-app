"use client"

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createWorkspaceAction } from "../actions";
import { createWorkspace } from "../types";

export function useCreateWorkspace() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(createWorkspaceAction, zodResolver(createWorkspace), {
        formProps: {
            defaultValues: {
                name: "",
                description: "",
                avatarUrl: "",
            },
        },
        actionProps: {
            onSuccess: ({ data }) => {
                toast.success("Workspace created successfully!");
                queryClient.invalidateQueries({ queryKey: ["workspaces"] });
                router.push(`/workspaces/${data?.workspace.id}`);
            },
            onError: ({ error }) => {
                toast.error(error.serverError?.message || "Failed to create workspace. Please try again.");
            },
        },
    });
}
