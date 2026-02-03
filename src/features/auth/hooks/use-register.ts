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

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current"] });

      toast.success("Account created successfully");
      router.replace("/workspace");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useRegister };
