import { getLoggedInUser } from "@/features/auth/actions/get-current";
import CreateWorkspaceForm from "@/features/workspace/components/create-workspace-form";
import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

const CreateWorkspacePage = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3,
      },
    },
  });

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getLoggedInUser,
  });

  if (!user.data) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1 w-full items-center justify-center bg-muted">
      <div className="w-full max-w-lg bg-card p-8 rounded-lg ring ring-muted-foreground/10 shadow-xs">
        <CreateWorkspaceForm />
      </div>
    </main>
  );
};

export default CreateWorkspacePage;
