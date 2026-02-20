"use client";

import { useQuery } from "@tanstack/react-query";

import { InferResponseType } from "hono";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<typeof client.api.workspace.$get>;

const useGetWorkspaces = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspace.$get();

      return response.json();
    },
  });

  return query;
};

export { useGetWorkspaces };
