"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { RoleTypes } from "@/generated/prisma/enums";

import { createProjectMemberAction } from "../actions";
import { createProjectMember } from "../types";

export function useCreateProjectMember(
    projectId: string,
    onSuccessCallback?: () => void
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useHookFormAction(
        createProjectMemberAction,
        zodResolver(createProjectMember),
        {
            formProps: {
                defaultValues: {
                    userEmail: "",
                    projectId,
                    role: RoleTypes.MEMBER,
                },
            },
            actionProps: {
                onSuccess: () => {
                    toast.success("New member added to project successfully!");
                    queryClient.invalidateQueries({
                        queryKey: ["project-members", projectId],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["project", projectId],
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
                            "Failed to add member to project. Please try again."
                    );
                },
            },
        }
    );
}
