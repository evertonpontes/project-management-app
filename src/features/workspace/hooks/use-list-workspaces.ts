import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/client";

type ResponseType = InferResponseType<typeof client.api.workspace.$get>;

const useListWorkspaces = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspace.$get();

      if (!response.ok)
        throw new Error(
          `${response.status} Something went wrong while getting workspaces`,
        );

      return response.json();
    },
  });

  return query;
};

export { useListWorkspaces };
