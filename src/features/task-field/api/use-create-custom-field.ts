"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api)["task-field"]["$post"],
  201
>;
type RequestType = InferRequestType<(typeof client.api)["task-field"]["$post"]>;

interface UseCreateCustomFieldProps {
  workspaceId: string;
}

const useCreateCustomField = ({ workspaceId }: UseCreateCustomFieldProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api["task-field"]["$post"]({
        json,
        query: { workspaceId },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customTaskFields"] });

      toast.success("Custom task field created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useCreateCustomField };
