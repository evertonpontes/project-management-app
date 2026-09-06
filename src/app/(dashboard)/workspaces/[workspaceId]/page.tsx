import { getWorkspaceById } from "@/features/workspace";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface WorkspaceIdProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceId({ params }: WorkspaceIdProps) {
  const { workspaceId } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const workspace = await getWorkspaceById(workspaceId);

  if (!data) {
    redirect("/login");
  }

  if (!workspace) {
    redirect("/workspaces");
  }

  return <div>Workspace ID: {workspace.name}</div>;
}
