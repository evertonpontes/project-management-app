import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { getWorkspace } from "@/features/workspace/actions/get-workspace";
import { getUser } from "@/lib/dal";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface SelectedWorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

const SelectedWorkspacePage = async ({
  params,
}: SelectedWorkspacePageProps) => {
  const { workspaceId } = await params;
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getUser,
  });

  const workspace = await queryClient.fetchQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => await getWorkspace({ workspaceId }),
  });

  if (!workspace) redirect("/workspace");

  if (!user) redirect("/sign-in");

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
