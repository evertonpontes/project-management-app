"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-up"]["$post"]({ json });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: async () => {
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["current"] });
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useRegister };
