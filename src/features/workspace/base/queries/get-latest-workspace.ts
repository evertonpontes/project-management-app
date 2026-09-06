"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLatestWorkspace() {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getClaims();

  if (!auth) {
    throw new Error("User is not authenticated");
  }

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*", { count: "exact" })
    .eq("owner_id", auth.claims.sub)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return workspaces;
}
