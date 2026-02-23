"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.member)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.member)[":memberId"]["$delete"]
>;

const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.member[":memberId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });

      toast.success("Member deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useDeleteMember };
