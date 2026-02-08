import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/dal";
import { WorkspaceForm } from "@/features/workspace/components/workspace-form";
import { getAllWorkspaces } from "@/features/workspace/actions/get-all-workspaces";

const WorkspacesPage = async () => {
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getUser,
  });

  await queryClient.prefetchQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  });

  if (!user) redirect("/sign-in");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex h-full min-h-svh flex-col w-full">
        <div className="flex items-center justify-center w-full h-full grow ">
          <WorkspaceForm />
        </div>
      </main>
    </HydrationBoundary>
  );
};

export default WorkspacesPage;
