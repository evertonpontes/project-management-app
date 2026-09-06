import { CreateWorkspace } from "@/features/workspace";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CreateWorkspacesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data) {
    redirect("/login");
  }

  return <CreateWorkspace />;
}
