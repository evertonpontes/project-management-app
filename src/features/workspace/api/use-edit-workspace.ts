"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["$patch"]
>;

const useEditWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspace[":workspaceId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return response.json();
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["workspace", response.data.$id],
      });

      router.refresh();

      toast.success("Workspace updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useEditWorkspace };
