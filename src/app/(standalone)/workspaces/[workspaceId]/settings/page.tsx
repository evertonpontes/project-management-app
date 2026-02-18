import { getWorkspaceById } from "@/features/workspace/actions/get-workspace-by-id";
import EditWorkspaceForm from "@/features/workspace/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceSettingsProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceSettingsPage = async ({ params }: WorkspaceSettingsProps) => {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById({ workspaceId });

  if (!workspace.data) {
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <main className="flex flex-1 w-full items-center justify-center bg-muted">
      <div className="w-full max-w-lg bg-card p-8 rounded-lg ring ring-muted-foreground/10 shadow-xs">
        <EditWorkspaceForm initialValues={workspace.data} />
      </div>
    </main>
  );
};

export default WorkspaceSettingsPage;
