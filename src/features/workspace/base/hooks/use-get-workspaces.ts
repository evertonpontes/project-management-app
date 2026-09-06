"use client";

import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "../queries";

type WorkspaceQuery = {
  page?: number;
  pageSize?: number;
};

export function useGetWorkspaces({
  page = 1,
  pageSize = 10,
}: WorkspaceQuery = {}) {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces({ page, pageSize }),
  });
}
