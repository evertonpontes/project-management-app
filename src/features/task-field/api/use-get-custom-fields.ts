"use client";

import { useQuery } from "@tanstack/react-query";

import { InferResponseType } from "hono";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<
  (typeof client.api)["task-field"]["$get"],
  200
>;

interface UseGetCustomFields {
  workspaceId: string;
}

const useGetCustomFields = ({ workspaceId }: UseGetCustomFields) => {
  const query = useQuery<ResponseType>({
    queryKey: ["customTaskFields"],
    queryFn: async () => {
      const response = await client.api["task-field"]["$get"]({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw Error("Error fetching custom task fields");
      }

      return response.json();
    },
  });

  return query;
};

export { useGetCustomFields };
