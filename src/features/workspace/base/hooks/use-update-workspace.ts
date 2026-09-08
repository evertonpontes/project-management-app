"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { updateWorkspace } from "../actions";
import { updateWorkspaceSchema } from "../schemas";

type WorkspaceUpdateFormValues = {
  name: string;
  description: string | null;
  image: string | null;
  workspaceId: string;
};

export function useUpdateWorkspace({ ...props }: WorkspaceUpdateFormValues) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { resetFormAndAction, ...hookFormProps } = useHookFormAction(
    updateWorkspace,
    zodResolver(updateWorkspaceSchema),
    {
      formProps: {
        defaultValues: {
          ...props,
          image: props.image ?? "",
          description: props.description ?? "",
        },
      },
      actionProps: {
        onSuccess: async ({ data: result }) => {
          await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

          toast.success("Workspace updated successfully.");

          router.refresh();
        },
        onError: ({ error }) => {
          if (error.serverError) {
            toast.error(error.serverError);
          } else {
            toast.error("Something went wrong. Please, try again later.");
          }
        },
      },
    },
  );

  return hookFormProps;
}
