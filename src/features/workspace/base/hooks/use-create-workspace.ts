"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "../actions";
import { createWorkspaceSchema } from "../schemas";

export function useCreateWorkspace() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { resetFormAndAction, ...props } = useHookFormAction(
    createWorkspace,
    zodResolver(createWorkspaceSchema),
    {
      formProps: {
        defaultValues: {
          name: "",
          description: "",
        },
      },
      actionProps: {
        onSuccess: async ({ data: result }) => {
          await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

          resetFormAndAction();

          toast.success("Workspace created in successfully.");

          router.push(`/workspaces/${result.data.id}`);
        },
        onError: ({ error }) => {
          if (error.serverError) {
            toast.error(error.serverError);
          } else {
            toast.error("Someting went wrong. Please, try again later.");
          }
        },
      },
    },
  );

  return props;
}
