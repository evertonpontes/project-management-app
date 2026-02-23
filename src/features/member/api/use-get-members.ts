"use client";

import { useQuery } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/client";

type ResponseType = InferResponseType<typeof client.api.member.$get, 200>;
type RequestType = InferRequestType<typeof client.api.member.$get>;

interface UseGetMemberProps {
  workspaceId: string;
}

const useGetMembers = ({ workspaceId }: UseGetMemberProps) => {
  const query = useQuery<ResponseType, Error, RequestType>({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.member.$get({ query: { workspaceId } });

      if (!response.ok) {
        throw Error("Error fetching members");
      }

      return response.json();
    },
  });

  return query;
};

export { useGetMembers };
