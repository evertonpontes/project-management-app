import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/features/auth/actions/get-current";
import { getWorkspaceInfo } from "@/features/workspace/actions/get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspace/components/join-workspace-form";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";

interface JoinWorkspacePageProps {
  params: Promise<{ workspaceId: string; inviteCode: string }>;
}

const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3,
      },
    },
  });

  const { workspaceId, inviteCode } = await params;

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getLoggedInUser,
  });

  const workspace = await getWorkspaceInfo({ workspaceId });

  if (!user.data) {
    redirect("/login");
  }

  if (!workspace.data) {
    redirect("/workspaces");
  }

  return (
    <main className="flex flex-1 flex-col w-full items-center justify-center bg-muted">
      <div className="w-full max-w-2xl p-6 md:p-8">
        <JoinWorkspaceForm workspaceName={workspace.data.workspaceName} />
      </div>
    </main>
  );
};
export default JoinWorkspacePage;
