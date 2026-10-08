"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { deleteWorkspaceMemberAction } from "../actions";
import { deleteWorkspaceMember, DeleteWorkspaceMemberInput } from "../types";

export function useDeleteWorkspaceMember(
    initialValues: DeleteWorkspaceMemberInput,
    onSuccessCallback?: () => void
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(
        deleteWorkspaceMemberAction,
        zodResolver(deleteWorkspaceMember),
        {
            formProps: {
                defaultValues: initialValues,
            },
            actionProps: {
                onSuccess: () => {
                    toast.success("Member deleted successfully!");
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
                            "Failed to delete member. Please try again."
                    );
                },
            },
        }
    );
}
