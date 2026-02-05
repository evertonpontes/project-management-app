import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-out"]["$post"]
>;

const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth["sign-out"]["$post"]();

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      return response.json();
    },
    onSuccess: async () => {
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["current"] });
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.success("Logout successful");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export { useLogout };
