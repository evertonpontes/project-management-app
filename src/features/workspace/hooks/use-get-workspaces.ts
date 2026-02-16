"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/client";

const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.workspace.$get();

      if (!response.ok) {
        return null;
      }

      return response.json();
    },
  });

  return query;
};

export { useGetWorkspaces };
