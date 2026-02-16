"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/client";

const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();

      if (!response.ok) {
        return null;
      }

      return response.json();
    },
  });

  return query;
};

export { useCurrent };
