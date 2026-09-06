"use server";

import { createClient } from "@/lib/supabase/server";

type WorkspaceQuery = {
  page?: number;
  pageSize?: number;
};

export async function getWorkspaces({ page = 1, pageSize = 10 }: WorkspaceQuery = {}) {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getClaims();

  if (!auth) {
    throw new Error("User is not authenticated");
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select(
      `
    id, 
    name, 
    description, 
    image_url, 
    created_at, 
    updated_at, 
    owner_id
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  return workspaces;
}
