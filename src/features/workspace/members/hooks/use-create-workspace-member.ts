"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createWorkspaceMemberAction } from "../actions";
import { createWorkspaceMember } from "../types";

export function useCreateWorkspaceMember(
    workspaceId: string,
    onSuccessCallback?: () => void
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(createWorkspaceMemberAction, zodResolver(createWorkspaceMember), {
        formProps: {
            defaultValues: {
                userEmail: "",
                workspaceId,
                role: "MEMBER",
            },
        },
        actionProps: {
            onSuccess: () => {
                toast.success("New member added to workspace successfully!");
                queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
                router.refresh();
                onSuccessCallback?.();
            },
            onError: ({ error }) => {
                toast.error(error.serverError?.message || "Failed to add member to workspace. Please try again.");
            },
        },
    });
}
