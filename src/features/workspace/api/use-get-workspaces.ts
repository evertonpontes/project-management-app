"use client";

import { useQuery } from "@tanstack/react-query";

import { InferResponseType } from "hono";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<typeof client.api.workspace.$get, 200>;

const useGetWorkspaces = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspace.$get();

      if (!response.ok) {
        throw Error("Error fetching workspaces");
      }

      return response.json();
    },
  });

  return query;
};

export { useGetWorkspaces };
