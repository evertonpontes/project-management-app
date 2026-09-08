import { getWorkspaceById, WorkspaceSettings } from "@/features/workspace";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface WorkspaceSettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceSettingsPage({
  params,
}: WorkspaceSettingsPageProps) {
  const { workspaceId } = await params;

  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getClaims();

  if (!auth) {
    redirect("/login");
  }

  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    redirect("/workspaces");
  }

  return (
    <WorkspaceSettings
      workspace={{
        name: workspace.name,
        description: workspace.description ?? "",
        image: workspace.image_url,
        workspaceId: workspace.id,
      }}
    />
  );
}
