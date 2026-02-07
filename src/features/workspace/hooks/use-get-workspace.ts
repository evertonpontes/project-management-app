import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["$get"]
>;

const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspace[":workspaceId"]["$get"]({
        param: { workspaceId },
      });

      if (!response.ok)
        throw new Error(
          `${response.status} Something went wrong while getting workspace`,
        );

      return response.json();
    },
  });

  return query;
};

export { useGetWorkspace };
