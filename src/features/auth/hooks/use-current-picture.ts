import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  typeof client.api.auth.current.picture.$get
>;

const useCurrentPicture = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["current", "picture"],
    queryFn: async () => {
      const response = await client.api.auth.current.picture.$get();

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      return response.json();
    },
  });

  return query;
};

export { useCurrentPicture };
