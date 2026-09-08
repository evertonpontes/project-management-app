"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { deleteWorkspace } from "../actions";
import { useQueryState, parseAsBoolean } from "nuqs";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { JSX } from "react/jsx-runtime";

export function useDeleteWorkspace({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { resetFormAndAction, ...hookFormProps } = useHookFormAction(
    deleteWorkspace,
    zodResolver(z.object({ workspaceId: z.uuid() })),
    {
      formProps: {
        defaultValues: {
          workspaceId,
        },
      },
      actionProps: {
        onSuccess: async ({ data: result }) => {
          await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

          toast.success("Workspace deleted successfully.");

          router.refresh();

          router.push("/workspaces");
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

export function useDeleteWorkspaceModal({
  workspaceId,
}: {
  workspaceId: string;
}): [() => void, JSX.Element] {
  const [open, setOpen] = useQueryState(
    "delete-workspace",
    parseAsBoolean.withDefault(false),
  );

  const openModalToggle = () => {
    setOpen(!open);
  };

  const { action } = useDeleteWorkspace({ workspaceId });

  const onSubmit = async () => {
    await action.executeAsync({ workspaceId });
    setOpen(false);
  };

  const DeleteWorkspaceModal = (
    <Modal
      open={open}
      onOpenChange={() => setOpen(!open)}
      title="Delete workspace"
      description="Permanetly delete this workspace and all its data. This action cannot be undone."
    >
      <div className="flex w-full flex-1 items-center justify-between gap-2 p-4">
        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" type="button" onClick={onSubmit}>
          {action.isPending ? "Deleting workspace..." : "Confirm"}
        </Button>
      </div>
    </Modal>
  );

  return [openModalToggle, DeleteWorkspaceModal];
}
