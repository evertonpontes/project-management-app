import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":id"]["$get"]
>;

const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspace[":id"]["$get"]({
        param: { id: workspaceId },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      return response.json();
    },
  });

  return query;
};

export { useGetWorkspace };
