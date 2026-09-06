"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWorkspaceById(workspaceId: string) {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getClaims();

  if (!auth) {
    throw new Error("User is not authenticated");
  }

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
    .eq("id", workspaceId)
    .single();

  return workspaces;
}
