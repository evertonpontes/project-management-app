import { redirect } from "next/navigation";
import { getWorkspace } from "@/features/workspace/actions/get-workspace";
import { getUser } from "@/lib/dal";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface WorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  const { workspaceId } = await params;
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getUser,
  });

  const workspace = await queryClient.fetchQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspace({ workspaceId }),
  });

  if (!user) redirect("/sign-in");

  if (!workspace) redirect("/workspace");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full flex-col w-full">
        <div className="flex items-center justify-center w-full h-full grow">
          Workspace
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default WorkspacePage;
