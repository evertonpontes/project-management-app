import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/client";

type ResponseType = InferResponseType<typeof client.api.auth.current.$get>;

const useCurrentUser = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      return response.json();
    },
  });

  return query;
};

export { useCurrentUser };
