"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<typeof client.api.workspace.$post, 201>;
type RequestType = InferRequestType<typeof client.api.workspace.$post>;

const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspace.$post({ form });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return response.json();
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      router.push(`/workspaces/${response.data.$id}`);

      toast.success("Workspace created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useCreateWorkspace };
