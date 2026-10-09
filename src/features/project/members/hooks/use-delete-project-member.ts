"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { deleteProjectMemberAction } from "../actions";
import { deleteProjectMember, type DeleteProjectMemberInput } from "../types";

export function useDeleteProjectMember(
    initialValues: DeleteProjectMemberInput,
    onSuccessCallback?: () => void
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(
        deleteProjectMemberAction,
        zodResolver(deleteProjectMember),
        {
            formProps: {
                defaultValues: initialValues,
            },
            actionProps: {
                onSuccess: () => {
                    toast.success("Member removed from project successfully!");
                    queryClient.invalidateQueries({
                        queryKey: ["project-members", initialValues.projectId],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["project", initialValues.projectId],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["projects"],
                    });
                    router.refresh();
                    onSuccessCallback?.();
                },
                onError: ({ error }) => {
                    toast.error(
                        error.serverError?.message ||
                            "Failed to remove member from project. Please try again."
                    );
                },
            },
        }
    );
}
