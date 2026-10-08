"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { updateWorkspaceMemberAction } from "../actions";
import { updateWorkspaceMember, UpdateWorkspaceMemberInput } from "../types";

export function useUpdateWorkspaceMember(
    initialValues: UpdateWorkspaceMemberInput,
    onSuccessCallback?: () => void
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(
        updateWorkspaceMemberAction,
        zodResolver(updateWorkspaceMember),
        {
            formProps: {
                defaultValues: initialValues,
            },
            actionProps: {
                onSuccess: () => {
                    toast.success("Member updated successfully!");
                    queryClient.invalidateQueries({
                        queryKey: [
                            "workspace-members",
                            initialValues.workspaceId,
                        ],
                    });
                    router.refresh();
                    onSuccessCallback?.();
                },
                onError: ({ error }) => {
                    toast.error(
                        error.serverError?.message ||
                            "Failed to update member role. Please try again."
                    );
                },
            },
        }
    );
}
