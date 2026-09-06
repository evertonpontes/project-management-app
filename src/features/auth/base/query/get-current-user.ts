"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return null;
  }

  return data?.claims;
}
