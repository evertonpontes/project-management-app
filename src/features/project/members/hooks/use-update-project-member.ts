"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { updateProjectMemberAction } from "../actions";
import { updateProjectMember, type UpdateProjectMemberInput } from "../types";

export function useUpdateProjectMember(
    initialValues: UpdateProjectMemberInput,
    onSuccessCallback?: () => void
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(
        updateProjectMemberAction,
        zodResolver(updateProjectMember),
        {
            formProps: {
                defaultValues: initialValues,
            },
            actionProps: {
                onSuccess: () => {
                    toast.success("Project member role updated successfully!");
                    queryClient.invalidateQueries({
                        queryKey: ["project-members", initialValues.projectId],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["project", initialValues.projectId],
                    });
                    router.refresh();
                    onSuccessCallback?.();
                },
                onError: ({ error }) => {
                    toast.error(
                        error.serverError?.message ||
                            "Failed to update project member role. Please try again."
                    );
                },
            },
        }
    );
}
