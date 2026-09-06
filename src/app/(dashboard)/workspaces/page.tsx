import { getLatestWorkspace } from "@/features/workspace";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WorkspacesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const workspace = await getLatestWorkspace();

  if (!data) {
    redirect("/login");
  }

  if (workspace) {
    redirect(`/workspaces/${workspace.id}`);
  } else {
    redirect("/workspaces/create");
  }
}
