import { CreateWorkspaceForm } from "@/features/workspace/components/create-workspace-form";

const CreateWorkspacePage = () => {
  return (
    <main className="flex min-h-svh h-full items-center justify-center w-full p-6 md-8 bg-muted">
      <CreateWorkspaceForm />
    </main>
  );
};

export default CreateWorkspacePage;
