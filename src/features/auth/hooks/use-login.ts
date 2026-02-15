"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;
type RequestType = InferRequestType<typeof client.api.auth.login.$post>;

const useLogin = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);

      router.push("/workspace");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useLogin };
