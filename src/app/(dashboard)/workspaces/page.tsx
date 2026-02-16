import { getWorkspaces } from "@/features/workspace/actions/get-workspaces";
import CreateWorkspaceForm from "@/features/workspace/components/create-workspace-form";

const WorkspacesPage = async () => {
  const workspaces = await getWorkspaces();

  console.log(workspaces);

  return (
    <main className="flex min-h-svh justify-center items-center w-full gap-6 md:gap-10 bg-muted">
      <div className="w-full max-w-md bg-card rounded-lg p-4 ring ring-muted-foreground/10 shadow-xs">
        <CreateWorkspaceForm />
      </div>
    </main>
  );
};

export default WorkspacesPage;
