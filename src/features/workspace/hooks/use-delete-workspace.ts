"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["$delete"]
>;

interface UseDeleteWorkspaceProps {
  workspaceId: string;
}

const useDeleteWorkspace = ({ workspaceId }: UseDeleteWorkspaceProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspace[":workspaceId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      });

      router.refresh();

      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useDeleteWorkspace };
