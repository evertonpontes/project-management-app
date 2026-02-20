"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["join"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["join"]["$post"]
>;

const useJoinWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspace[":workspaceId"]["join"][
        "$post"
      ]({
        param,
        json,
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

      router.push(`/workspaces/${response.data.$id}`);

      toast.success("Joined workspace");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useJoinWorkspace };
