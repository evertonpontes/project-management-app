import { Header } from "@/components/header";
import { getWorkspace } from "@/features/workspace/actions/get-workspace";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface SelectedWorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

const SelectedWorkspacePage = async ({
  params,
}: SelectedWorkspacePageProps) => {
  const { workspaceId } = await params;
  const queryClient = new QueryClient();

  const workspace = await queryClient.fetchQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => await getWorkspace({ workspaceId }),
  });

  if (!workspace) redirect("/workspace");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex h-full min-h-svh flex-col w-full">
        <Header />
        <div className="flex items-center justify-center w-full h-full grow ">
          Workspace
        </div>
      </main>
    </HydrationBoundary>
  );
};

export default SelectedWorkspacePage;
