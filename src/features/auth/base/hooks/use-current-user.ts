"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../query";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  return query;
}
